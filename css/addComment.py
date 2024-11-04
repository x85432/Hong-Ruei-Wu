import os

def add_text_to_file_header(file_path, text):
    with open(file_path, 'r+', encoding='utf-8') as file:
        content = file.read()
        file.seek(0, 0)
        file.write(text + '\n' + content)

# 要添加的文字
text_to_add = """/*
111652049 吳弘叡 第三次作業 11/1
111652049 Hong-Ruei Wu The Third Homework 11/1
*/"""

# 目標資料夾路徑
folder_path = '.'  # 替換為你的資料夾路徑

# 遍歷資料夾中的所有檔案（不包括子資料夾）
for file_name in os.listdir(folder_path):
    file_path = os.path.join(folder_path, file_name)
    # 確保只對檔案操作，而不是資料夾
    if os.path.isfile(file_path):
        add_text_to_file_header(file_path, text_to_add)
