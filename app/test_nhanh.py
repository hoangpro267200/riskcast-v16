import anthropic
import os

# Đây là Key bạn vừa gửi
MY_KEY = "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"

print("⏳ Đang kết nối tới Claude...")

try:
    client = anthropic.Anthropic(api_key=MY_KEY)
    
    message = client.messages.create(
        model="claude-3-haiku-20240307",
        messages=[
            {"role": "user", "content": "Chào bạn, nếu bạn trả lời được câu này nghĩa là code đã chạy ngon lành!"}
        ]
    )
    print("\n✅ THÀNH CÔNG RỒI! Claude trả lời:")
    print("------------------------------------------------")
    print(message.content[0].text)
    print("------------------------------------------------")

except Exception as e:
    print("\n❌ VẪN LỖI KẾT NỐI:")
    print(e)
    