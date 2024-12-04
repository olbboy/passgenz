'use client'

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface Section {
  id: string
  title: string
}

interface PasswordStrength {
  type: string
  time: string
  variant: "default" | "destructive" | "outline"
}

export function GuideContent(): JSX.Element {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("")

  const sections: Section[] = [
    { id: "intro", title: "Understanding Modern Password Security" },
    { id: "foundation", title: "The Foundation of Strong Passwords" },
    { id: "strength", title: "Password Strength in Practice" },
    { id: "beyond", title: "Beyond Traditional Passwords" },
    { id: "implementation", title: "Practical Security Implementation" },
    { id: "future", title: "Future-Proofing Your Security" },
  ]

  const strengthExamples8Char: PasswordStrength[] = [
    { type: "Chỉ dùng chữ thường", time: "Ngay lập tức", variant: "destructive" },
    { type: "Thêm chữ HOA", time: "30 phút", variant: "outline" },
    { type: "Thêm số (123)", time: "1 giờ", variant: "outline" },
    { type: "Thêm ký tự đặc biệt (@#$)", time: "24 giờ", variant: "default" },
  ]

  const strengthExamples12Char: PasswordStrength[] = [
    { type: "Chỉ dùng chữ thường", time: "Vài tuần", variant: "outline" },
    { type: "Thêm chữ HOA", time: "5 năm", variant: "default" },
    { type: "Thêm số (123)", time: "2,000 năm", variant: "default" },
    { type: "Thêm ký tự đặc biệt (@#$)", time: "63,000 năm", variant: "default" },
  ]

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const container = e.target as HTMLElement
      const progress = (container.scrollTop / (container.scrollHeight - container.clientHeight)) * 100
      setScrollProgress(progress)

      const sectionElements = sections.map(s => document.getElementById(s.id))
      const currentSection = sectionElements.find(el => {
        if (!el) return false
        const rect = el.getBoundingClientRect()
        return rect.top >= 0 && rect.top <= window.innerHeight / 3
      })
      if (currentSection) {
        setActiveSection(currentSection.id)
      }
    }

    const scrollContainer = document.querySelector('.scroll-container')
    scrollContainer?.addEventListener('scroll', handleScroll)
    return () => scrollContainer?.removeEventListener('scroll', handleScroll)
  }, [sections])

  const renderStrengthExample = (strength: PasswordStrength) => (
    <div key={strength.type} className="flex justify-between items-center">
      <span>{strength.type}</span>
      <Badge variant={strength.variant}>{strength.time}</Badge>
    </div>
  )

  return (
    <div className="h-full flex flex-col">
      <Progress value={scrollProgress} className="w-full" />
      <ScrollArea className="flex-1 h-[calc(100vh-8rem)] scroll-container">
        <div className="px-6 py-8 max-w-[900px] mx-auto space-y-12">
          {/* Giới thiệu */}
          <section id="intro" className="scroll-mt-16">
            <Alert className="mb-8 bg-yellow-500/15 border-yellow-500/50">
              <AlertDescription className="text-base font-medium">
                Bạn có biết? 81% các vụ rò rỉ thông tin xảy ra do mật khẩu yếu hoặc bị đánh cắp!
              </AlertDescription>
            </Alert>
            
            <p className="text-lg text-muted-foreground">
              Trong thời đại internet ngày nay, việc bảo vệ mật khẩu của bạn rất quan trọng. 
              Giống như việc bạn khóa cửa nhà để bảo vệ đồ đạc, mật khẩu mạnh sẽ giúp bảo vệ 
              thông tin cá nhân của bạn trên mạng.
            </p>
          </section>

          {/* Nguyên tắc cơ bản */}
          <section id="foundation" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">Hai điều quan trọng về mật khẩu</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-3">1. Mỗi tài khoản một mật khẩu riêng</h3>
                <p className="text-sm text-muted-foreground">
                  Hãy tưởng tượng: Nếu bạn dùng cùng một chìa khóa cho cả nhà và két sắt, 
                  khi kẻ gian lấy được chìa khóa, họ sẽ lấy được tất cả đồ của bạn. 
                  Mật khẩu cũng vậy - mỗi tài khoản nên có một mật khẩu riêng!
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-3">2. Mật khẩu phải thật ngẫu nhiên</h3>
                <p className="text-sm text-muted-foreground">
                  Đừng dùng những thông tin dễ đoán như ngày sinh, tên thú cưng hay số điện thoại. 
                  Hãy tạo mật khẩu thật ngẫu nhiên để khó bị đoán ra!
                </p>
              </Card>
            </div>
          </section>

          {/* Độ mạnh mật khẩu */}
          <section id="strength" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">Mật khẩu mạnh - yếu ra sao?</h2>
            <div className="space-y-6">
              <div className="prose prose-sm dark:prose-invert mb-4">
                <p>
                  Khi tạo mật khẩu, độ dài và độ phức tạp của mật khẩu quyết định thời gian 
                  cần thiết để hacker có thể phá được mật khẩu của bạn. Hãy xem các ví dụ sau:
                </p>
              </div>

              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Mật khẩu 8 ký tự:</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    {strengthExamples8Char.map(renderStrengthExample)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">🤔 Điều này có nghĩa là gì?</p>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>
                        <span className="font-medium">Ngay lập tức</span>: Nếu chỉ dùng chữ thường 
                        (như "password"), máy tính có thể đoán ra ngay
                      </li>
                      <li>
                        <span className="font-medium">30 phút</span>: Thêm chữ HOA (như "Password") 
                        sẽ khó hơn một chút, nhưng vẫn không đủ an toàn
                      </li>
                      <li>
                        <span className="font-medium">1 giờ</span>: Thêm số (như "Password123") 
                        cũng chưa đủ mạnh
                      </li>
                      <li>
                        <span className="font-medium">24 giờ</span>: Thêm ký tự đặc biệt 
                        (như "Password@123") tốt hơn, nhưng vẫn chưa thực sự an toàn
                      </li>
                    </ul>
                    <p className="mt-3 text-yellow-500 dark:text-yellow-400">
                      ⚠️ Kết luận: Mật khẩu 8 ký tự, dù phức tạp đến đâu, vẫn có thể bị phá 
                      trong vòng 1 ngày!
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Mật khẩu 12 ký tự:</h3>
                <div className="space-y-6">
                  <div className="space-y-3">
                    {strengthExamples12Char.map(renderStrengthExample)}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p className="font-medium">🤔 Điều này có nghĩa là gì?</p>
                    <ul className="list-disc list-inside space-y-1.5">
                      <li>
                        <span className="font-medium">Vài tuần</span>: Chỉ dùng chữ thường 
                        (như "helloeveryone") vẫn chưa đủ an toàn
                      </li>
                      <li>
                        <span className="font-medium">5 năm</span>: Thêm chữ HOA 
                        (như "HelloEveryone") đã khó phá hơn nhiều
                      </li>
                      <li>
                        <span className="font-medium">2,000 năm</span>: Thêm số 
                        (như "HelloEveryone123") rất khó để phá được
                      </li>
                      <li>
                        <span className="font-medium">63,000 năm</span>: Thêm ký tự đặc biệt 
                        (như "HelloEveryone@123") gần như không thể phá được bằng công nghệ hiện tại
                      </li>
                    </ul>
                    <p className="mt-3 text-green-500 dark:text-green-400">
                      ✅ Kết luận: Mật khẩu 12 ký tự trở lên, kết hợp đủ loại ký tự sẽ 
                      RẤT AN TOÀN!
                    </p>
                  </div>
                </div>
              </Card>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium">💡 Mẹo hay:</span> Thay vì nhớ các ký tự 
                  phức tạp, bạn có thể dùng một câu dễ nhớ và thêm số, ký tự đặc biệt. 
                  Ví dụ: "Tôi thích ăn phở" → "ToiThich@nPho2024"
                </p>
              </div>
            </div>
          </section>

          {/* Cách tạo mật khẩu tốt */}
          <section id="tips" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">Mẹo tạo mật khẩu an toàn</h2>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Những điều NÊN làm:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Dùng ít nhất 12 ký tự</li>
                  <li>Kết hợp chữ HOA, chữ thường, số và ký tự đặc biệt</li>
                  <li>Dùng cụm từ ngẫu nhiên (ví dụ: "MèoXanhThích@Cá2024")</li>
                  <li>Thay đổi mật khẩu quan trọng mỗi 3-6 tháng</li>
                </ul>
              </Card>
              
              <Card className="p-6">
                <h3 className="font-medium text-lg mb-4">Những điều KHÔNG NÊN làm:</h3>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Dùng thông tin cá nhân (ngày sinh, tên, số điện thoại)</li>
                  <li>Dùng các từ trong từ điển</li>
                  <li>Dùng mật khẩu quá đơn giản (123456, password)</li>
                  <li>Dùng cùng một mật khẩu cho nhiều tài khoản</li>
                </ul>
              </Card>
            </div>
          </section>

          {/* Lời khuyên thêm */}
          <section id="extra" className="scroll-mt-16">
            <h2 className="text-2xl font-semibold mb-6">Mẹo bảo vệ tài khoản</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Ngoài việc đặt mật khẩu mạnh, bạn nên:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                  <li>Bật xác thực 2 lớp nếu có thể</li>
                  <li>Không chia sẻ mật khẩu với người khác</li>
                  <li>Không nhập mật khẩu trên máy tính công cộng</li>
                  <li>Dùng trình quản lý mật khẩu để lưu trữ an toàn</li>
                </ul>
              </div>
            </Card>
          </section>
        </div>
      </ScrollArea>
    </div>
  )
} 