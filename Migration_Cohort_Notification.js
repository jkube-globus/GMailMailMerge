function SendEmail() {

  const TEST_RUN = true;

  const TEST_TO = 'james@globus.org';
  const SUBJECT = 'Please migrate your Globus endpoint to Globus Connect Server v5';
  const FROM_NAME = 'Globus Support';
  const REPLY_TO = 'support@globus.org';
  //const EMAIL_HTML_TEMPLATE = 'GCS4ToGCS5Email'
  const EMAIL_HTML_TEMPLATE = 'ExamplePage'
//ep_uuid, dsiplay_name, organization, owner, admin_email
  const SHEET_KEY = {
    // table data
    ENDPOINT_ID: 0,
    ENDPOINT_NAME: 1,
    SUBORG_NAME: 2,
    ENDPOINT_OWNER: 3,
    EMAIL_ADDRESS: 4,
  };

  // This is the sheet with the list of users and detailed information driving the notifications
  const data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("DEV-Cohort 4");

  const rows = data.getRange("AP2:AT" + data.getLastRow()).getValues();

  // the actual email notifications we'll send out.
  const notifications = {};
  // map through the data/worksheet and covert to an object that represents
  // a single entry per email address.
  rows.forEach(function (row) {
    const email = row[SHEET_KEY.EMAIL_ADDRESS];
    if (!notifications[email]) {
      notifications[email] = {
        recipient: email,
        table: {
          rows: []
        }
      }
    }
    notifications[email].table.rows.push({
      endpoint_id: row[SHEET_KEY.ENDPOINT_ID],
      endpoint_name: row[SHEET_KEY.ENDPOINT_NAME],
      endpoint_suborg: row[SHEET_KEY.SUBORG_NAME],
      endpoint_owner: row[SHEET_KEY.ENDPOINT_OWNER]
    });
  });

  let sent = 0;
  //foreach notif in notifications?
  Object.values(notifications).forEach((notif) => {
    if (TEST_RUN === true && sent > 2) return;
    const emailTemplate = HtmlService.createTemplateFromFile(EMAIL_HTML_TEMPLATE);
    emailTemplate.table = notif.table;
    //above is how we pass in out values to the HTML template

    const htmlMessage = emailTemplate.evaluate().getContent();
    let to = TEST_TO;
    if (TEST_RUN === false) {
      to = notif.recipient;
    }
    GmailApp.sendEmail(
      to,
      SUBJECT,
      "Your email doesn't support HTML.",
      { name: FROM_NAME, htmlBody: htmlMessage, replyTo: REPLY_TO }
    );
    sent = sent + 1;
    console.log(`sent notification | to=${to}`);
  });

  console.log(`sent ${sent} notifications`);
}
