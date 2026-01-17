from app.models import IncomeSource, MonthlyEarning

# Clear existing data
IncomeSource.objects.all().delete()
MonthlyEarning.objects.all().delete()

# Populating Income Sources
sources = [
    { "name": 'Swiggy', "amount": 12300, "verified": True },
    { "name": 'Zomato', "amount": 9800, "verified": True },
    { "name": 'Freelance / Fiverr', "amount": 15000, "verified": True },
    { "name": 'Cash Jobs', "amount": 6500, "verified": False },
    { "name": 'UPI Transfers', "amount": 5150, "verified": True },
]

for s in sources:
    IncomeSource.objects.create(
        name=s["name"], 
        amount=s["amount"], 
        verified=s["verified"], 
        status='verified' if s['verified'] else 'needs-proof'
    )

# Populating Monthly Earnings
monthly_data = [
    { "month": 'Jul', "amount": 42000 },
    { "month": 'Aug', "amount": 45500 },
    { "month": 'Sep', "amount": 48200 },
    { "month": 'Oct', "amount": 46800 },
    { "month": 'Nov', "amount": 51300 },
    { "month": 'Dec', "amount": 48750 },
]

for m in monthly_data:
    MonthlyEarning.objects.create(month=m["month"], amount=m["amount"])

print("Database populated successfully!")
