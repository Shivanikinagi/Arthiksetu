from sms_parser import SMSParser

parser = SMSParser()

# Extensive list of mixed inputs
inputs = [
    # --- VALID ---
    "Rs 1,200 credited to account XX88 from ZOMATO MEDIA PVT LTD.",
    "SWIGGY: Rs 450 has been credited to your floating balance.",
    "Dear partner, your weekly payout of Rs 3,500 from UBER is processed.",
    "Zepto Payout: Rs 890 credited to your bank account.",
    "Received Rs 200 from BLINKIT for delivery #9988.",
    "Dunzo: Payment of Rs 150 processed for task #11.",
    "Porter Wallet: Rs 600 added successfully.",
    "UrbanCompany: Service earnings of Rs 1200 credited.",
    
    # --- INVALID / NOISE ---
    "Paid Rs 20 for Tea at Chayu.",
    "Sent Rs 5000 to Landlord via GPay.",
    "Jio: Recharge of Rs 666 successful.",
    "Your bank A/c is debited for Rs 500.00 using sbi upi.",
    "Spam: You won Rs 100000 lottery! Click here."
]

print(f"{'INPUT SMS MESSAGE':<60} | {'STATUS':<10} | {'RESULT'}")
print("-" * 100)

for msg in inputs:
    # We use extract_info directly to see what happens before filtering
    # But to simulate the app, we check the filtering logic manually here
    info = parser.extract_info(msg)
    
    status = "IGNORED ❌"
    result_str = ""
    
    if info['merchant'] in parser.allowed_platforms:
        status = "MATCHED ✅"
        result_str = f"{info['merchant']} (+Rs {info['amount']})"
        
    # Truncate msg for display
    display_msg = (msg[:57] + '...') if len(msg) > 57 else msg
    
    print(f"{display_msg:<60} | {status:<10} | {result_str}")
