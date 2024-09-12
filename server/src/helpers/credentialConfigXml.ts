// const escapeXml = (unsafe: string) => {
//   return unsafe
//     .replace(/&/g, "&amp;")
//     .replace(/</g, "&lt;")
//     .replace(/>/g, "&gt;")
//     .replace(/"/g, "&quot;")
//     .replace(/'/g, "&apos;");
// };

// const createCredentialsXml = (
//   id: string,
//   username: string,
//   password: string,
//   description?: string
// ) => {
//   return `
//   <?xml version='1.1' encoding='UTF-8'?>
//   <com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
//      <scope>GLOBAL</scope>
//      <id>${escapeXml(id)}</id>
//      <description>${escapeXml(description || "")}</description>
//      <username>${escapeXml(username)}</username>
//      <password>${escapeXml(password)}</password>
//    </com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>`;
// };

//export { createCredentialsXml };

const createCredentialsXml = (
  id: string,
  username: string,
  password: string,
  description?: string
) => {
  // Escape special characters in XML
  const escapeXml = (str: string) => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  };

  return `<?xml version='1.1' encoding='UTF-8'?>
<com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>
  <scope>GLOBAL</scope>
  <id>${escapeXml(id)}</id>
  <description>${escapeXml(description || "")}</description>
  <username>${escapeXml(username)}</username>
  <password>${escapeXml(password)}</password>
</com.cloudbees.plugins.credentials.impl.UsernamePasswordCredentialsImpl>`;
};

export { createCredentialsXml };
