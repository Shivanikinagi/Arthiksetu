import os
import django
import firebase_admin
from firebase_admin import credentials, firestore

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')
django.setup()

from app.models import IncomeSource, MonthlyEarning

def migrate_data():
    # Initialize Firebase
    try:
        cred = credentials.Certificate('serviceAccountKey.json')
        firebase_admin.initialize_app(cred)
        db = firestore.client()
        print("Connected to Firebase Firestore.")
    except Exception as e:
        print(f"Error connecting to Firebase: {e}")
        return

    print("\nMigrating Income Sources...")
    income_sources = IncomeSource.objects.all()
    count_inc = 0
    for source in income_sources:
        data = {
            'name': source.name,
            'amount': source.amount,
            'status': source.status,  # Using status from model
            'verified': source.verified # Using verified boolean from model
        }
        # Use name generally as ID or let firestore auto-gen. Auto-gen is safer.
        db.collection('income_sources').add(data)
        print(f" -> Uploaded: {source.name}")
        count_inc += 1

    print(f"Uploaded {count_inc} Income Sources.")

    print("\nMigrating Monthly Earnings...")
    monthly_earnings = MonthlyEarning.objects.all()
    count_earn = 0
    for earning in monthly_earnings:
        data = {
            'month': earning.month,
            'amount': earning.amount 
        }
        db.collection('monthly_earnings').add(data)
        print(f" -> Uploaded: {earning.month}")
        count_earn += 1

    print(f"Uploaded {count_earn} Monthly Earning records.")
    print("\n-----------------------------------")
    print("SUCCESS: Data migration to Firebase complete!")
    print("-----------------------------------")

if __name__ == '__main__':
    migrate_data()
