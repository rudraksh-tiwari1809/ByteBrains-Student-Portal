"""ByteBrains FastAPI backend. Run from project root with:
python -m uvicorn backend.main:app --reload
"""
from __future__ import annotations
import hashlib, hmac, os, secrets
from datetime import date, datetime
from typing import Any
from fastapi import APIRouter, Depends, FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from .database import Base, engine, get_db
from .Models import *
from .Models.assessment_attempts import AssessmentAttempt

app = FastAPI(title="ByteBrains API", version="1.0.0", description="Academia–Industry Collaboration Portal backend.")
raw_origins = os.getenv("CORS_ORIGINS", "*").strip()
origins = [x.strip() for x in raw_origins.split(",") if x.strip()] or ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
def startup():
    Base.metadata.create_all(bind=engine)
    seed_catalog()

def _json(v: Any): return v.isoformat() if isinstance(v, (datetime, date)) else v
def serialize(obj: Any) -> dict[str, Any]:
    return {c.key: _json(getattr(obj, c.key)) for c in inspect(obj.__class__).columns}
def public_user(obj: Any):
    d=serialize(obj); d.pop("password_hash", None); return d

def hash_password(password:str)->str:
    salt=secrets.token_bytes(16); digest=hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 310_000)
    return f"pbkdf2_sha256$310000${salt.hex()}${digest.hex()}"
def verify_password(password:str, encoded:str)->bool:
    try:
        alg, rounds, salt, digest=encoded.split("$",3)
        if alg!="pbkdf2_sha256": return False
        got=hashlib.pbkdf2_hmac("sha256", password.encode(), bytes.fromhex(salt), int(rounds)).hex()
        return hmac.compare_digest(got,digest)
    except Exception: return False

def db_error(exc:IntegrityError):
    return HTTPException(400,"Database constraint failed. Check required fields, unique values, and foreign-key IDs.")

@app.get("/")
def root(): return {"status":"ByteBrains backend running","version":app.version}
@app.get("/health")
def health(): return {"status":"ok"}
@app.get("/db-test")
def db_test(db:Session=Depends(get_db)): return {"database_connected":True,"result":db.execute(text("SELECT 1")).scalar()}

class AuthRouter:
    def __init__(self, model, prefix, tag):
        self.model=model; self.router=APIRouter(prefix=prefix,tags=[tag]); self.add()
    def add(self):
        model=self.model
        @self.router.post("/register",status_code=201)
        def register(payload:dict[str,Any],db:Session=Depends(get_db)):
            data=dict(payload); password=data.pop("password",None)
            if not password: raise HTTPException(422,"password is required")
            data.pop("password_hash",None); data["email"]=str(data.get("email","")).strip().lower(); data["password_hash"]=hash_password(str(password))
            allowed={c.key for c in inspect(model).columns}; data={k:v for k,v in data.items() if k in allowed and k not in {"id","created_at"}}
            try:
                obj=model(**data); db.add(obj); db.commit(); db.refresh(obj); return public_user(obj)
            except IntegrityError as exc: db.rollback(); raise db_error(exc)
        @self.router.post("/login")
        def login(payload:dict[str,Any],db:Session=Depends(get_db)):
            email=str(payload.get("email","")).strip().lower(); password=payload.get("password")
            obj=db.query(model).filter(model.email==email).first()
            if not obj or not password or not verify_password(str(password),obj.password_hash): raise HTTPException(401,"Invalid email or password")
            return {"authenticated":True,"user":public_user(obj)}
for m,p,t in [(Student,"/auth/student","Student Auth"),(Company,"/auth/company","Company Auth"),(Faculty,"/auth/faculty","Faculty Auth")]: app.include_router(AuthRouter(m,p,t).router)

@app.get("/students/{student_id}/profile")
def profile(student_id:int,db:Session=Depends(get_db)):
    obj=db.get(Student,student_id)
    if not obj: raise HTTPException(404,"Student not found")
    return public_user(obj)
@app.patch("/students/{student_id}/profile")
def update_profile(
    student_id: int,
    data: dict,
    db: Session = Depends(get_db)
):
    obj = db.get(Student, student_id)

    if not obj:
        raise HTTPException(404, "Student not found")

    allowed_fields = [
        "phone",
        "location",
        "enrollment",
        "about",
    ]

    for field in allowed_fields:
        if field in data:
            setattr(obj, field, data[field])

    db.commit()
    db.refresh(obj)

    return public_user(obj)
@app.get("/students/{student_id}/skills")
def skills(student_id: int, db: Session = Depends(get_db)):
    rows = (
        db.query(StudentSkill, Skill)
        .join(Skill, Skill.id == StudentSkill.skill_id)
        .filter(StudentSkill.student_id == student_id)
        .all()
    )

    result = []

    for ss, s in rows:
        latest_attempt = (
            db.query(AssessmentAttempt)
            .join(Assessment, Assessment.id == AssessmentAttempt.assessment_id)
            .filter(
                AssessmentAttempt.student_id == student_id,
                Assessment.skill_id == s.id
            )
            .order_by(AssessmentAttempt.attempted_at.desc())
            .first()
        )

        score = float(latest_attempt.percentage) if latest_attempt else 0

        result.append({
            "id": ss.id,
            "skill_id": s.id,
            "name": s.name,
            "proficiency": ss.proficiency,
            "score": score,
        })

    return result
@app.get("/students/{student_id}/skill-profile")
def skill_profile(student_id:int,db:Session=Depends(get_db)):
    rows=skills(student_id,db); scores=[float(x["score"] or 0) for x in rows]
    gaps=[]
    for x in rows:
        score=float(x["score"] or 0)
        if score<70: gaps.append({"skill":x["name"],"current":round(score),"target":70,"severity":"high" if score<50 else "medium"})
    avg=round(sum(scores)/len(scores)) if scores else 0
    technical_names={"Python Programming","SQL & Databases","Machine Learning","Java","React","AWS","Linux","Docker","Data Analysis"}
    tech=[float(x["score"] or 0) for x in rows if x["name"] in technical_names]
    soft=[float(x["score"] or 0) for x in rows if x["name"] not in technical_names]
    return {"skills":rows,"gaps":gaps,"overall":avg,"technical_average":round(sum(tech)/len(tech)) if tech else avg,"soft_average":round(sum(soft)/len(soft)) if soft else 0}

@app.get("/internships")
def internships(limit:int=Query(50,ge=1,le=200),db:Session=Depends(get_db)):
    rows=db.query(Internship).filter(Internship.status=="open").order_by(Internship.posted_at.desc()).limit(limit).all()
    return enrich_internships(rows,db)
@app.get("/students/{student_id}/internships")
def student_internships(student_id:int,db:Session=Depends(get_db)):
    rows=db.query(Internship).filter(Internship.status=="open").order_by(Internship.posted_at.desc()).all()
    return enrich_internships(rows,db,student_id)
def enrich_internships(rows,db,student_id=None):
    student_scores={x["skill_id"]:float(x["score"] or 0) for x in skills(student_id,db)} if student_id else {}
    out=[]
    for i in rows:
        company=db.get(Company,i.company_id) if i.company_id else None
        req=db.query(InternshipSkill,Skill).join(Skill,Skill.id==InternshipSkill.skill_id).filter(InternshipSkill.internship_id==i.id).all()
        names=[s.name for _,s in req]; match=0
        if names and student_scores:
            vals=[student_scores.get(s.id,0) for _,s in req]; match=round(sum(vals)/len(vals))
        d=serialize(i); d.update({"company":company.name if company else "Industry Partner","skills":names,"match_score":match}); out.append(d)
    return out
@app.get("/students/{student_id}/recommendations")
def recommendations(student_id:int,db:Session=Depends(get_db)):
    rows=db.query(Internship).filter(Internship.status=="open").all()
    return sorted(enrich_internships(rows,db,student_id),key=lambda x:x.get("match_score",0),reverse=True)[:6]
@app.get("/students/{student_id}/applications")
def applications(student_id:int,db:Session=Depends(get_db)):
    rows=db.query(Application).filter(Application.student_id==student_id).order_by(Application.applied_at.desc()).all(); out=[]
    for a in rows:
        d=serialize(a); i=db.get(Internship,a.internship_id); d["internship"]=serialize(i) if i else None; out.append(d)
    return out
@app.post("/students/{student_id}/internships/{internship_id}/apply")
def apply(student_id:int,internship_id:int,db:Session=Depends(get_db)):
    if not db.get(Student,student_id): raise HTTPException(404,"Student not found")
    if not db.get(Internship,internship_id): raise HTTPException(404,"Internship not found")
    existing=db.query(Application).filter(Application.student_id==student_id,Application.internship_id==internship_id).first()
    if existing: return serialize(existing)
    a=Application(student_id=student_id,internship_id=internship_id,status="applied"); db.add(a); db.commit(); db.refresh(a); return serialize(a)

@app.post("/students/{student_id}/assessments/submit")
def submit_assessment(student_id:int,payload:dict[str,Any],db:Session=Depends(get_db)):
    if not db.get(Student,student_id): raise HTTPException(404,"Student not found")
    category=str(payload.get("category","")).lower(); score=float(payload.get("score",0)); total=int(payload.get("total",0))
    if total<=0 or score<0 or score>total: raise HTTPException(422,"Invalid score or total")
    names={"python":"Python Programming","sql":"SQL & Databases","ml":"Machine Learning","aptitude":"Quantitative Aptitude","comm":"Communication Skills"}
    skill_name=names.get(category,category.title()); skill=db.query(Skill).filter(Skill.name==skill_name).first()
    if not skill: skill=Skill(name=skill_name); db.add(skill); db.flush()
    pct=round(score/total*100,2); proficiency="Beginner" if pct<50 else "Intermediate" if pct<75 else "Advanced"
    ss=db.query(StudentSkill).filter(StudentSkill.student_id==student_id,StudentSkill.skill_id==skill.id).first()
    if not ss:
        ss = StudentSkill(student_id=student_id, skill_id=skill.id)
        db.add(ss)

    ss.proficiency = proficiency
    assessment=db.query(Assessment).filter(Assessment.skill_id==skill.id).first()
    if not assessment: assessment=Assessment(title=f"{skill_name} Assessment",skill_id=skill.id,total_marks=total,passing_marks=max(1,round(total*.5))); db.add(assessment); db.flush()
    attempt=AssessmentAttempt(student_id=student_id,assessment_id=assessment.id,score=score,total_marks=total,percentage=pct,status="passed" if pct>=50 else "needs_improvement"); db.add(attempt)
    # Refresh skill gaps and recommendations are derived from the current skill profile.
    for gap in db.query(SkillGap).filter(SkillGap.student_id==student_id,SkillGap.missing_skill_id==skill.id).all(): db.delete(gap)
    if pct<70: db.add(SkillGap(student_id=student_id,missing_skill_id=skill.id,severity="high" if pct<50 else "medium"))
    db.commit(); db.refresh(attempt)
    return {"attempt_id":attempt.id,"percentage":pct,"recommendations_updated":len(recommendations(student_id,db))}

# Student profile content endpoints.
def student_rows(model,student_id,db): return [serialize(x) for x in db.query(model).filter(model.student_id==student_id).all()]
@app.get("/students/{student_id}/portfolio")
def portfolio(student_id:int,db:Session=Depends(get_db)): return student_rows(PortfolioProject,student_id,db)
@app.post("/students/{student_id}/portfolio")
def add_portfolio_project(
    student_id: int,
    project: dict,
    db: Session = Depends(get_db)
):
    new_project = PortfolioProject(
        student_id=student_id,
        title=project.get("title"),
        description=project.get("description"),
        project_url=project.get("project_url"),
        github_url=project.get("github_url"),
        technologies=project.get("technologies"),
    )

    db.add(new_project)
    db.commit()
    db.refresh(new_project)

    return new_project
@app.get("/students/{student_id}/education")
def education(student_id:int,db:Session=Depends(get_db)): return student_rows(Education,student_id,db)
@app.post("/students/{student_id}/education")
def add_education(
    student_id: int,
    education: dict,
    db: Session = Depends(get_db)
):
    new_education = Education(
        student_id=student_id,
        institution=education.get("institution"),
        degree=education.get("degree"),
        field_of_study=education.get("field_of_study"),
        start_year=education.get("start_year"),
        end_year=education.get("end_year"),
        grade=education.get("grade"),
    )

    db.add(new_education)
    db.commit()
    db.refresh(new_education)

    return new_education
@app.get("/students/{student_id}/experience")
def experience(student_id:int,db:Session=Depends(get_db)): return student_rows(Experience,student_id,db)
@app.post("/students/{student_id}/experience")
def add_experience(
    student_id: int,
    experience: dict,
    db: Session = Depends(get_db)
):
    new_experience = Experience(
        student_id=student_id,
        company_name=experience.get("company_name"),
        role=experience.get("role"),
        description=experience.get("description"),
        start_date=experience.get("start_date"),
        end_date=experience.get("end_date"),
        is_current=experience.get("is_current", False),
    )

    db.add(new_experience)
    db.commit()
    db.refresh(new_experience)

    return new_experience
@app.get("/students/{student_id}/certifications")
def certifications(student_id:int,db:Session=Depends(get_db)): return student_rows(Certification,student_id,db)
@app.post("/students/{student_id}/certifications")
def add_certification(
    student_id: int,
    certification: dict,
    db: Session = Depends(get_db)
):
    new_certification = Certification(
        student_id=student_id,
        name=certification.get("name"),
        issuing_organization=certification.get("issuing_organization"),
    )

    db.add(new_certification)
    db.commit()
    db.refresh(new_certification)

    return new_certification

@app.get("/students/{student_id}/achievements")
def achievements(student_id:int,db:Session=Depends(get_db)): return student_rows(Achievement,student_id,db)
@app.post("/students/{student_id}/achievements")
def add_achievement(
    student_id: int,
    achievement: dict,
    db: Session = Depends(get_db)
):
    new_achievement = Achievement(
        student_id=student_id,
        title=achievement.get("title"),
    )

    db.add(new_achievement)
    db.commit()
    db.refresh(new_achievement)

    return new_achievement
@app.get("/students/{student_id}/resume")
def resume(student_id:int,db:Session=Depends(get_db)): return student_rows(Resume,student_id,db)
@app.get("/courses")
def courses(db:Session=Depends(get_db)): return [serialize(x) for x in db.query(Course).order_by(Course.created_at.desc()).all()]
@app.get("/events")
def events(db:Session=Depends(get_db)): return [serialize(x) for x in db.query(Event).order_by(Event.event_date.asc()).limit(10).all()]
@app.get("/jobs")
def jobs(db:Session=Depends(get_db)): return internships(50,db)

# Generic API kept for Academy/Industry compatibility.
RESOURCES={"students":Student,"companies":Company,"faculty":Faculty,"skills":Skill,"student-skills":StudentSkill,"resumes":Resume,"internships":Internship,"applications":Application,"skill-gaps":SkillGap,"recommendations":Recommendation,"internship-skills":InternshipSkill,"portfolio-projects":PortfolioProject,"certifications":Certification,"education":Education,"experiences":Experience,"achievements":Achievement,"courses":Course,"course-enrollments":CourseEnrollment,"assessments":Assessment,"assessment-questions":AssessmentQuestion,"assessment-attempts":AssessmentAttempt,"institutions":Institution,"departments":Department,"events":Event,"collaborations":Collaboration,"notifications":Notification,"mentorships":Mentorship}
def register_crud(resource,model):
    router=APIRouter(prefix=f"/api/{resource}",tags=[resource]); cols={c.key for c in inspect(model).columns}
    @router.get("")
    def listing(limit:int=Query(50,ge=1,le=200),offset:int=Query(0,ge=0),db:Session=Depends(get_db)): return {"items":[serialize(x) for x in db.query(model).offset(offset).limit(limit).all()],"count":db.query(model).count(),"limit":limit,"offset":offset}
    @router.get("/{item_id}")
    def getone(item_id:int,db:Session=Depends(get_db)):
        x=db.get(model,item_id)
        if not x: raise HTTPException(404,"Item not found")
        return public_user(x) if "password_hash" in cols else serialize(x)
    @router.post("",status_code=201)
    def create(payload:dict[str,Any],db:Session=Depends(get_db)):
        data={k:v for k,v in payload.items() if k in cols and k!="id"}
        if "password_hash" in cols and "password" in payload: data["password_hash"]=hash_password(str(payload["password"]))
        try: x=model(**data); db.add(x); db.commit(); db.refresh(x); return public_user(x) if "password_hash" in cols else serialize(x)
        except IntegrityError as exc: db.rollback(); raise db_error(exc)
    @router.patch("/{item_id}")
    def patch(item_id:int,payload:dict[str,Any],db:Session=Depends(get_db)):
        x=db.get(model,item_id)
        if not x: raise HTTPException(404,"Item not found")
        for k,v in payload.items():
            if k in cols and k not in {"id","password_hash"}: setattr(x,k,v)
        db.commit(); db.refresh(x); return public_user(x) if "password_hash" in cols else serialize(x)
    app.include_router(router)
for r,m in RESOURCES.items(): register_crud(r,m)

def seed_catalog():
    db=next(get_db())
    try:
        # Catalog seed is idempotent and never creates a student.
        skill_names=["Python Programming","SQL & Databases","Machine Learning","Communication Skills","Quantitative Aptitude","React","AWS","Docker","Deep Learning"]
        skill_map={s.name:s for s in db.query(Skill).all()}
        for name in skill_names:
            if name not in skill_map: skill_map[name]=Skill(name=name); db.add(skill_map[name]); db.flush()
        company=db.query(Company).first()
        if not company:
            company=Company(name="ByteBrains Industry Partner",email="partner@bytebrains.demo",password_hash=hash_password("Demo@1234"),industry_type="Technology",location="India"); db.add(company); db.flush()
        if db.query(Internship).count()==0:
            data=[("Data Science Intern","Python, ML","Remote","₹25,000 / month","Remote",["Python Programming","Machine Learning"]),("AI/ML Intern","Build ML solutions","Bangalore, India","₹30,000 / month","On-site",["Machine Learning","Deep Learning"]),("Software Development Intern","Frontend and API development","Pune, India","₹18,000 / month","Hybrid",["React","Python Programming"]),("Business Analytics Intern","Analytics and reporting","Remote","₹20,000 / month","Remote",["SQL & Databases"])]
            for title,desc,loc,stip,mode,names in data:
                i=Internship(company_id=company.id,title=title,description=desc,location=loc,duration="3 months",stipend=stip,mode=mode,status="open"); db.add(i); db.flush()
                for n in names: db.add(InternshipSkill(internship_id=i.id,skill_id=skill_map[n].id))
        if db.query(Course).count()==0:
            for title,provider,level,duration,desc in [("Machine Learning Foundations","ByteBrains Academy","Intermediate","8 weeks","Build the core ML skills needed for internships."),("Complete Python Programming","ByteBrains Academy","Beginner","6 weeks","Strengthen Python and problem-solving skills."),("Advanced SQL for Analytics","ByteBrains Academy","Advanced","4 weeks","Learn SQL for analytics and data roles."),("Professional Communication","ByteBrains Academy","Beginner","2 weeks","Improve communication and interview readiness.")]: db.add(Course(title=title,provider=provider,level=level,duration=duration,description=desc))
        if db.query(Event).count()==0:
            now=datetime.now(); db.add_all([Event(title="Future of AI in Industry",description="Industry webinar",event_type="Webinar",location="Online",event_date=now),Event(title="Industry Mentorship Program",description="Career mentoring session",event_type="Mentorship",location="Online",event_date=now)])
        db.commit()
    finally: db.close()
