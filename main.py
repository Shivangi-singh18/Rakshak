from datetime import datetime

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import models
import schemas
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Rakshak API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Statutory provisions invoked per complaint category when drafting the petition.
_CATEGORY_PROVISIONS: dict[str, list[str]] = {
    "fraud": [
        "Section 11(1) read with Section 12A(b) of the Securities and Exchange "
        "Board of India Act, 1988 ('SEBI Act')",
        "Regulation 3(a) and 4 of the SEBI (Prohibition of Fraudulent and "
        "Unfair Trade Practices) Regulations, 2003",
        "Section 247 of the Companies Act, 2013 (where a listed company is involved)",
    ],
    "insider_trading": [
        "Section 12A(b) of the SEBI Act, 1988",
        "Regulations 3, 4 and 5 of the SEBI (Prohibition of Insider Trading) "
        "Regulations, 2015",
    ],
    "unclaimed_dividend": [
        "Sections 124 and 125 of the Companies Act, 2013",
        "SEBI (Investor Education and Protection Fund) Authority Regulations, 2016",
        "Section 11(1) of the SEBI Act, 1988 (to the extent listed securities are involved)",
    ],
    "misleading_disclosure": [
        "Regulations 30, 30A and 33 of the SEBI (Listing Obligations and "
        "Disclosure Requirements) Regulations, 2015",
        "Section 11(1) read with Section 12A(b) of the SEBI Act, 1988",
    ],
}
_DEFAULT_PROVISIONS = [
    "Section 11(1) of the SEBI Act, 1988 (protecting the interests of investors "
    "in securities and promoting the development of, and regulating, the securities market)",
    "Section 12A(b) of the SEBI Act, 1988 (SEBI's power to order inquiries and investigations)",
]


def generate_sebi_scores_petition(category: str, raw_story: str, user_id: int) -> str:
    """Programmatically draft a professional SEBI SCORES petition."""
    key = category.strip().lower().replace("-", "_").replace(" ", "_")
    provisions = _CATEGORY_PROVISIONS.get(key, _DEFAULT_PROVISIONS)
    provisions_text = "\n".join(
        f"\t\t({chr(ord('a') + i)}) {p}" for i, p in enumerate(provisions)
    )
    story_lines = "\n".join(f"\t\t{line}" for line in raw_story.splitlines())
    today = datetime.now().strftime("%d %B %Y")
    return "".join((
        "BEFORE THE SECURITIES AND EXCHANGE BOARD OF INDIA\n"
        "(Through the SEBI Complaints Redress System \u2014 SCORES)\n"
        "\n"
        "COMPLAINT / PETITION\n"
        "=====================\n"
        "\n"
        "To,\n"
        "The Chairperson,\n"
        "Securities and Exchange Board of India,\n"
        "SEBI Bhavan, Plot No. C4-A, 'G' Block,\n"
        "Bandra Kurla Complex, Mumbai \u2013 400 051.\n"
        "\n"
        f"Date: {today}\n"
        "\n"
        "Subject: Complaint under the SEBI Act, 1988 read with the SEBI "
        "(Complaints Redress System) framework \u2014 ",
        f"{category.strip()}\n",
        "\n"
        "Respected Sir/Madam,\n",
        "\n"
        "I, the undersigned, being an aggrieved investor, most respectfully "
        "submit this complaint through the SEBI SCORES platform and request "
        "its consideration in accordance with law.\n",
        "\n"
        "1. COMPLAINANT\n",
        "\tComplaint reference (User ID): ",
        f"{user_id}\n",
        "\n"
        "2. CATEGORY OF COMPLAINT\n",
        f"\t{category.strip()}\n",
        "\n"
        "3. STATEMENT OF FACTS\n",
        f"{story_lines}\n",
        "\n"
        "The facts set out above are true and correct to the best of my "
        "knowledge and belief.\n",
        "\n"
        "4. APPLICABLE LAW AND GROUNDS\n",
        f"{provisions_text}\n",
        "\n"
        "5. PRAYER\n",
        "\tIn view of the facts and circumstances stated above, it is "
        "most respectfully prayed that the Hon\u2019ble Board may be "
        "pleased to:\n"
        "\t\t(a) treat this complaint as a complaint under the SEBI "
        "(Complaints Redress System) framework and register it for "
        "redressal;\n"
        "\t\t(b) cause an enquiry/investigation into the matters "
        "set out above;\n"
        "\t\t(c) direct restitution of the investor losses, including "
        "interest, if the allegations are found to be substantiated;\n"
        "\t\t(d) initiate such civil, civil-criminal, adjudicatory or "
        "other proceedings as deemed fit against the defaulting "
        "party/parties; and\n"
        "\t\t(e) pass any other order(s) as the Hon\u2019ble Board may "
        "deem fit in the interest of investors and the securities market.\n",
        "\n"
        "6. VERIFICATION\n",
        "\tI verify that the contents of this complaint are true to the "
        "best of my knowledge and belief, and nothing material has been "
        "concealed therefrom.\n",
        "\n"
        "Place: Mumbai\n",
        f"Date: {today}\n",
        "\n"
        "\t\t\t\t\tYours faithfully,\n"
        "\t\t\t\t\t(Complainant)\n"
        f"\t\t\t\t\tUser ID: {user_id}\n",
    ))


@app.post("/api/v1/triage", response_model=schemas.ComplaintResponse, status_code=201)
def create_complaint(
    payload: schemas.ComplaintCreate,
    db: Session = Depends(get_db),
) -> schemas.ComplaintResponse:
    user_id = payload.user_id if payload.user_id is not None else 1
    complaint = models.Complaint(
        user_id=user_id,
        category=payload.category,
        raw_story=payload.raw_story,
        status="DRAFT",
        formatted_petition=generate_sebi_scores_petition(
            category=payload.category,
            raw_story=payload.raw_story,
            user_id=user_id,
        ),
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)
    return schemas.ComplaintResponse(
        id=complaint.id,
        category=complaint.category,
        status=complaint.status,
        formatted_petition=complaint.formatted_petition,
        created_at=complaint.created_at,
        message="Draft petition generated and saved successfully.",
    )


@app.get("/api/v1/iepf/search")
def search_iepf(pan_number: str) -> dict:
    if pan_number == "ABCDE1234F":
        return {
            "status": "found",
            "amount": 45000,
            "company": "Reliance Industries",
            "folio": "RIL998877",
        }
    return {
        "status": "not_found",
        "message": "No unclaimed dividends found.",
    }
