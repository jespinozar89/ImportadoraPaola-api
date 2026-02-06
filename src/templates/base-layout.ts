export const getBaseLayout = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8f9fa; }
    .container { width: 100%; max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
    .header { background-color: #0d6efd; color: white; padding: 20px; text-align: center; }
    .content { padding: 30px; color: #333; line-height: 1.6; }
    .footer { background-color: #f1f1f1; color: #777; padding: 15px; text-align: center; font-size: 12px; }
    .btn { display: inline-block; padding: 10px 20px; color: white; background-color: #0d6efd; text-decoration: none; border-radius: 5px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>${title}</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© 2026 Tu Sistema ERP - Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
`;