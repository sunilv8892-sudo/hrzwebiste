import openpyxl
import json
import uuid

file_path = 'HRZ_Pitstop_Client_Inventory_All_Bike_Models.xlsx'
wb = openpyxl.load_workbook(file_path, data_only=True)

# Default images by category
fallback_images = {
    'Bike Protection': 'images/crash_guard_product.webp',
    'Handlebar & Accessories': 'images/phone_mount_product.webp',
    'Foot Rests': 'images/bash_plate_product.webp',
    'Guards & Mounts': 'images/crash_guard_product.webp',
    'Oil Caps & Stands': 'images/bash_plate_product.webp',
    'Body Fairing and Fenders': 'images/category_protection.webp',
    'Bike Essentials': 'images/intercom_product.webp',
    'Cleaning Accessories': 'images/bash_plate_product.webp',
    'Performance Accessories': 'images/bash_plate_product.webp',
    'Lighting': 'images/fog_lights_product.webp',
    'Riding Gears': 'images/jacket.webp',
    'Luggage & Touring': 'images/saddlebags_product.webp',
    'Helmets & Accessories': 'images/helmet_product.webp',
    'General Accessories': 'images/phone_mount_product.webp'
}

products = []

for sheet_name in wb.sheetnames[:14]:
    sheet = wb[sheet_name]
    for row in range(2, sheet.max_row + 1):
        name = sheet.cell(row=row, column=1).value
        if not name: continue
        
        sub_cat = sheet.cell(row=row, column=2).value
        brand = sheet.cell(row=row, column=3).value
        bike_make = sheet.cell(row=row, column=4).value
        bike_model = sheet.cell(row=row, column=5).value
        
        mrp = sheet.cell(row=row, column=6).value
        sell_price = sheet.cell(row=row, column=7).value
        stock = sheet.cell(row=row, column=9).value
        image_url = sheet.cell(row=row, column=10).value
        description = sheet.cell(row=row, column=11).value
        
        if not sell_price:
            sell_price = mrp if mrp else 0
        if not mrp:
            mrp = sell_price
            
        try:
            sell_price = float(sell_price)
            mrp = float(mrp)
        except:
            sell_price = 0
            mrp = 0
            
        unique_id = str(uuid.uuid4())[:8].upper()
        prod_id = "prod-" + unique_id
        sku = "HRZ-" + unique_id
            
        # Determine Bike Compatibility
        bike_compat = []
        if bike_make and bike_make != "Universal":
            if bike_model and bike_model != "Universal":
                bike_compat.append(f"{bike_make} {bike_model}")
            else:
                bike_compat.append(bike_make)
        else:
            bike_compat.append("Universal")
            
        # Select best image
        image = fallback_images.get(sheet_name, 'images/bash_plate_product.webp')
        
        # Override image based on subcategory or name if possible
        n = str(name).lower()
        if 'helmet' in n: image = 'images/helmet_product.webp'
        elif 'saddle' in n or 'bag' in n: image = 'images/saddlebags_product.webp'
        elif 'light' in n or 'fog' in n: image = 'images/fog_lights_product.webp'
        elif 'jacket' in n: image = 'images/jacket.webp'
        elif 'glove' in n: image = 'images/gloves.webp'
        elif 'boot' in n: image = 'images/boot.webp'
        
        # USE THE REAL IMAGE FROM EXCEL IF IT EXISTS!
        if image_url and str(image_url).strip() != "":
            image = str(image_url).strip()
            
        prod = {
            "id": prod_id,
            "name": name,
            "category": sheet_name,
            "subcategory": sub_cat,
            "brand": brand,
            "price": sell_price,
            "originalPrice": mrp,
            "image": image,
            "gallery": [image],
            "rating": 4.8,
            "reviewCount": 10,
            "ridersInstalled": 10,
            "inStock": True,
            "sku": sku,
            "bike_compatibility": bike_compat,
            "highlights": [description] if description else []
        }
        
        products.append(prod)

with open('data/products.json', 'w', encoding='utf-8') as f:
    json.dump(products, f, indent=2)

print(f"Successfully exported {len(products)} products to data/products.json")
