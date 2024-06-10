function createHeader(name) {

  let formattedString = `version=54;
name="${name}";
author="A3 QR Code Generator";
category="QR Codes";
requiredAddons[]=
{
	"A3_Ui_F"
};`;

  return formattedString;
}

export default createHeader;