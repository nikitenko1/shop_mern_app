const authEmail = (text, url) => {
  const data = `
        <div style="border: 5px solid #ccc; padding: 15px;">
          <h1 style="text-align: center;">Let&apos;s work | Kyiv ${text}</h1>
          <p>Please click below button to proceed the chosen action</p>
          <a style="display: block; text-decoration: none; background: orange; color: #fff; width: 130px; height: 35px; text-align: center; line-height: 35px; margin-top: 15px" href=${url}>Click Me</a>
          <div style="margin-top: 20px;">
            <p>Thank you for using <strong>Let&apos;s work | Kyiv</strong> for LMS application"
            <p>Warm Regards,</p>
            <p>- Let&apos;s work | Kyiv Team -</p>
          </div>
        </div>
      `;
  return data;
};

module.exports = authEmail;
