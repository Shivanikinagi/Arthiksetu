import re

class SMSParser:
    def __init__(self):
        # Patterns for extraction
        self.amount_pattern = re.compile(r'(?:Rs\.?|INR)\s*([\d,]+(?:\.\d{2})?)', re.IGNORECASE)
        self.merchant_patterns = {
            'Zomato': re.compile(r'zomato', re.IGNORECASE),
            'Swiggy': re.compile(r'swiggy', re.IGNORECASE),
            'Zepto': re.compile(r'zepto', re.IGNORECASE),
            'Blinkit': re.compile(r'blinkit|grofers', re.IGNORECASE),
            'Dunzo': re.compile(r'dunzo', re.IGNORECASE),
            'Uber': re.compile(r'uber', re.IGNORECASE),
            'Ola': re.compile(r'ola', re.IGNORECASE),
            'Porter': re.compile(r'porter', re.IGNORECASE),
            'Rapido': re.compile(r'rapido', re.IGNORECASE),
            'UrbanCompany': re.compile(r'urban\s*company|urbanclap', re.IGNORECASE),
            'Amazon': re.compile(r'amazon', re.IGNORECASE), # Flex
            'Flipkart': re.compile(r'flipkart', re.IGNORECASE), # Delivery
        }
        self.credit_pattern = re.compile(r'(credited|received|added|deposited)', re.IGNORECASE)
        self.debit_pattern = re.compile(r'(debited|deducted|spent|paid|sent)', re.IGNORECASE)

        # Platforms to explicitly allow (Gig/Work platforms)
        self.allowed_platforms = {
            'Zomato', 'Swiggy', 'Zepto', 'Blinkit', 'Dunzo', 
            'Uber', 'Ola', 'Porter', 'Rapido', 'UrbanCompany',
            'Amazon', 'Flipkart'
        }

    def extract_info(self, text):
        data = {
            "amount": 0.0,
            "merchant": "Unknown",
            "type": "transaction", # credit or debit
            "raw": text
        }
        
        # Extract Amount
        match = self.amount_pattern.search(text)
        if match:
            amount_str = match.group(1).replace(',', '')
            try:
                data['amount'] = float(amount_str)
            except:
                pass
        
        # Determine Type (Credit/Debit)
        if self.credit_pattern.search(text):
            data['type'] = 'credit'
        elif self.debit_pattern.search(text):
            data['type'] = 'debit'
            
        # Extract Merchant
        found_merchant = False
        for name, pattern in self.merchant_patterns.items():
            if pattern.search(text):
                data['merchant'] = name
                found_merchant = True
                break
        
        if not found_merchant:
             # If we haven't found a key platform, we check generic 'By X'
             # BUT, if the user only wants specific platforms, we might ignore this
             # or tag it as Unknown/Other.
             # For strict filtering, we will only return data if it matches our list.
             pass

        return data

    def parse_batch(self, messages):
        results = []
        for msg in messages:
            info = self.extract_info(msg)
            # FILTERING LOGIC: Only strictly allow known platforms
            if info['merchant'] in self.allowed_platforms:
                results.append(info)
        return results
