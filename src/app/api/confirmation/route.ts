import { NextRequest, NextResponse } from "next/server";

// Вказуємо runtime для Vercel
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * API route для обробки approvedUrl від WayForPay
 * WayForPay робить POST запит на цей URL після успішної оплати
 * Ми повертаємо HTML з автоматичним редиректом на сторінку /confirmation
 */
export async function POST(req: NextRequest) {
  try {
    const baseUrl = req.nextUrl.origin;
    const confirmationUrl = `${baseUrl}/confirmation`;
    
    // Логування для діагностики
    console.log("POST запит на /api/confirmation отримано");
    
    // Повертаємо HTML з автоматичним редиректом
    // Це працює навіть якщо WayForPay робить POST через форму
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=${confirmationUrl}">
  <script>
    window.location.replace("${confirmationUrl}");
  </script>
</head>
<body>
  <p>Перенаправлення на сторінку підтвердження... <a href="${confirmationUrl}">Натисніть тут</a></p>
</body>
</html>`;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    });
  } catch (error) {
    console.error("Помилка в POST /api/confirmation:", error);
    const baseUrl = req.nextUrl.origin;
    const confirmationUrl = `${baseUrl}/confirmation`;
    return NextResponse.redirect(confirmationUrl, 303);
  }
}

// Обробка GET на випадок, якщо хтось зайде напряму
export async function GET(req: NextRequest) {
  const baseUrl = req.nextUrl.origin;
  const confirmationUrl = new URL("/confirmation", baseUrl);
  
  // Зберігаємо query параметри, якщо вони є
  const searchParams = req.nextUrl.searchParams;
  if (searchParams.toString()) {
    confirmationUrl.search = searchParams.toString();
  }
  
  return NextResponse.redirect(confirmationUrl, 302);
}

