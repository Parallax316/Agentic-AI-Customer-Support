import os

# Specify the exact path to your files
knowledge_dir = os.path.join('c:\\Users\\simar\\Desktop\\AI_powered_customer support', 'customer_Support_bot data', 'knowledge_base')

print(f"Checking files in: {knowledge_dir}")
print(f"Directory exists: {os.path.exists(knowledge_dir)}")

# List all files in the directory to verify
try:
    all_files = os.listdir(knowledge_dir)
    print(f"All files in directory: {all_files}")
except Exception as e:
    print(f"Error listing directory: {e}")

# Check specific files
files_to_check = [
    "password_reset_guide.txt",
    "refund_process.txt",
    "return_policy.txt"
]

for filename in files_to_check:
    file_path = os.path.join(knowledge_dir, filename)
    print(f"\nChecking file: {file_path}")
    print(f"File exists: {os.path.exists(file_path)}")
    
    if os.path.exists(file_path):
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                size = len(content)
                print(f"File size: {size} characters")
                if size > 0:
                    print(f"First 100 characters: {content[:100]}")
                else:
                    print("FILE APPEARS EMPTY")
                    
            # Try alternative encodings if UTF-8 returned empty
            if size == 0:
                encodings = ['latin-1', 'cp1252', 'ascii']
                for encoding in encodings:
                    try:
                        with open(file_path, 'r', encoding=encoding) as f:
                            content = f.read()
                            size = len(content)
                            print(f"Using {encoding} encoding - File size: {size} characters")
                            if size > 0:
                                print(f"First 100 characters: {content[:100]}")
                                break
                    except Exception as e:
                        print(f"Error with {encoding} encoding: {e}")
        except Exception as e:
            print(f"Error reading file: {e}")