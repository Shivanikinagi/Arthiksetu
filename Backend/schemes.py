SCHEMES_DB = [
  {
    "id": 1,
    "name": "PM-SVANidhi",
    "description": "Micro Credit Scheme for Street Vendors",
    "benefit": "Loan up to ₹10,000",
    "eligibleAmount": 10000,
    "status": "eligible", 
    "details": "Low-interest working capital loan with digital transaction incentives",
    "criteria": {
        "min_age": 18,
        "occupation_tags": ["vendor", "hawker", "street"],
        "max_income": 300000
    },
    "category": "Loan",
    "url": "https://pmsvanidhi.mohua.gov.in/"
  },
  {
    "id": 2,
    "name": "Atal Pension Yojana",
    "description": "Guaranteed pension for old age security",
    "benefit": "Monthly pension ₹1,000-₹5,000",
    "eligibleAmount": 3000,
    "status": "eligible",
    "details": "Contributory pension scheme with government co-contribution",
    "criteria": {
        "min_age": 18,
        "max_age": 40,
        "citizenship": "Indian"
    },
    "category": "Pension",
    "url": "https://www.npscra.nsdl.co.in/scheme-details.php"
  },
  {
    "id": 3,
    "name": "PMJJBY",
    "description": "Pradhan Mantri Jeevan Jyoti Bima Yojana",
    "benefit": "₹2,00,000 life insurance",
    "eligibleAmount": 200000,
    "status": "eligible",
    "details": "Life insurance coverage at just ₹436 per year",
    "criteria": {
        "min_age": 18,
        "max_age": 50,
        "has_bank_account": True
    },
    "category": "Insurance",
    "url": "https://financialservices.gov.in/beta/en/pmjjby"
  },
  {
    "id": 4,
    "name": "PM-SBY",
    "description": "Suraksha Bima Yojana",
    "benefit": "₹2,00,000 accident cover",
    "eligibleAmount": 200000,
    "status": "eligible",
    "details": "Accidental death & disability cover at ₹20 per year",
    "criteria": {
        "min_age": 18,
        "max_age": 70,
        "has_bank_account": True
    },
    "category": "Insurance",
    "url": "https://financialservices.gov.in/beta/en/pmsby"
  },
  {
    "id": 5,
    "name": "PMEGP",
    "description": "Employment Generation Programme",
    "benefit": "Loan up to ₹25,00,000",
    "eligibleAmount": 2500000,
    "status": "pending",
    "details": "Subsidy-linked loans for setting up micro-enterprises",
    "criteria": {
        "min_age": 18,
        "requires_business_plan": True
    },
    "category": "Business",
    "url": "https://www.kviconline.gov.in/pmegpeportal/pmegphome/index.jsp"
  },
  {
    "id": 6,
    "name": "Stand-Up India",
    "description": "Entrepreneurship support scheme",
    "benefit": "Loan ₹10L-₹1Cr",
    "eligibleAmount": 1000000,
    "status": "pending",
    "details": "Bank loans for SC/ST/Women entrepreneurs",
    "criteria": {
        "min_age": 18,
        "target_group": ["SC", "ST", "Women"],
        "project_type": ["Greenfield"]
    },
    "category": "Business",
    "url": "https://www.standupmitra.in/"
  },
  {
    "id": 7,
    "name": "Ayushman Bharat",
    "description": "Pradhan Mantri Jan Arogya Yojana",
    "benefit": "₹5 Lakh Health Cover",
    "eligibleAmount": 500000,
    "status": "eligible",
    "details": "Health insurance for low-income families",
    "criteria": {
        "max_income": 500000
    },
    "category": "Insurance",
    "url": "https://pmjay.gov.in/"
  },
]

def check_eligibility(scheme, profile):
    criteria = scheme.get("criteria", {})
    
    # Age Check
    if "min_age" in criteria and profile.get("age") and profile["age"] < criteria["min_age"]:
        return False
    if "max_age" in criteria and profile.get("age") and profile["age"] > criteria["max_age"]:
        return False
        
    # Occupation Check (Basic tag matching)
    if "occupation_tags" in criteria and profile.get("occupation"):
        user_occ = profile["occupation"].lower()
        if not any(tag in user_occ for tag in criteria["occupation_tags"]):
            return False
            
    # Income Check (Annual)
    if "max_income" in criteria and profile.get("income"):
        # print(f"Checking income: User {profile['income']} vs Max {criteria['max_income']}")
        if profile["income"] > criteria["max_income"]:
            return False

    # Target Group
    if "target_group" in criteria and profile.get("category"):
         if profile["category"] not in criteria["target_group"]:
             # If user category is not in target group, maybe they are not eligible
             # But simplistic logic: if specific groups required, and user not in them -> False
             return False

    return True

def get_eligible_schemes(user_profile):
    """
    user_profile: dict with keys: age, income, occupation, category(optional), etc.
    """
    eligible = []
    for scheme in SCHEMES_DB:
        s = scheme.copy()
        if check_eligibility(scheme, user_profile):
            s['status'] = 'eligible'
        else:
            s['status'] = 'ineligible'
            
        eligible.append(s)
    return eligible

def simplify_scheme_explanation(scheme):
    """
    Simplifies government scheme explanation for easy understanding.
    """
    simple_text = f"""
    🎯 {scheme['name']}
    
    What you get: {scheme['benefit']}
    
    Simple explanation: {scheme['description']}
    
    Who can apply: """
    
    criteria = scheme.get('criteria', {})
    if 'min_age' in criteria:
        simple_text += f"Age {criteria['min_age']}+"
    if 'max_age' in criteria:
        simple_text += f" to {criteria['max_age']}"
    if 'max_income' in criteria:
        simple_text += f", Income below ₹{criteria['max_income']:,}"
    if 'occupation_tags' in criteria:
        simple_text += f", Occupation: {', '.join(criteria['occupation_tags'])}"
    
    simple_text += f"\\n\\nCategory: {scheme.get('category', 'General')}"
    simple_text += f"\\n\\nApply at: {scheme.get('url', 'Contact local office')}"
    
    return simple_text
