const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

// Returns promise from fs.writeFile
const writeFileAsync = util.promisify(fs.writeFile);

// Function for inquirer that provides a series of prompts to user to build answers object
// that is used with the README template (generateREADME) to create the content of the README.md file.
const promptUser = () => {
	return inquirer.prompt([
		{
			type: "input",
			name: "title",
			message: "Project title:",
			validate(input) {
				if (!input) {
					return console.log("\nA project title is required.");
				}

				return true;
			},
		},
		{
			type: "input",
			name: "description",
			message: "Description:",
			validate(input) {
				if (!input) {
					return console.log("\nA description for your project is required.");
				}

				return true;
			},
		},
		{
			type: "input",
			name: "installation",
			message: "Installation instructions:",
		},
		{
			type: "input",
			name: "usage",
			message: "Usage instructions:",
		},
		{
			type: "input",
			name: "contributing",
			message: "Contributing instructions:",
		},
		{
			type: "input",
			name: "test",
			message: "Testing instructions:",
		},
		{
			type: "list",
			name: "license",
			message: "Choose a license:",
			choices: ["MIT", "ISC", "Apache License 2.0", "GNU GPLv3"],
		},
		{
			type: "input",
			name: "username",
			message: "GitHub username of project creator:",
		},
		{
			type: "input",
			name: "email",
			message: "Email of project creator:",
			// Uses regex from https://emailregex.com/ for email validation if an email is provided
			validate(input) {
				const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

				if (input && !input.match(regex)) {
					return console.log("\nInvalid email");
				}

				return true;
			},
		},
	]);
};

// Details the badge color and url path for each license
const licenseObj = {
	MIT: {
		color: "green",
		path: "mit",
	},
	ISC: {
		color: "blue",
		path: "isc",
	},
	"Apache License 2.0": {
		color: "blueviolet",
		path: "apache-2.0",
	},
	"GNU GPLv3": {
		color: "red",
		path: "gpl-3.0",
	},
};

// Generates the markdown for a general section of the README
const generateSection = (header, info) => {
	return `## ${header}
${info}`;
};

// Specifically generates the markdown for the Questions section of the README
const generateQuestionsSection = (username, email) => {
	let emailLine;
	let usernameLine;

	// Conditionally assign `emailLine` and `usernameLine` if either are provided
	email
		? (emailLine = `Please feel free to contact via email if you have any questions pertaining to this project.  
Email: ${email}  `)
		: (emailLine = "");
	username
		? (usernameLine = `[GitHub Profile](https://github.com/${username})`)
		: (usernameLine = "");

	return `## Questions
${emailLine}
${usernameLine}`;
};

// Generates the markdown for the badge license using shields.io
const generateLicenseBadge = (license, color) =>
	`![license](https://img.shields.io/static/v1?label=license&message=${encodeURIComponent(
		license
	)}&color=${color}&style=for-the-badge)`;

// Creates a link for information on a specific license provided from `licenseObj[license].path`
const generateLicenseUrl = licensePath =>
	`https://choosealicense.com/licenses/${licensePath}`;

// Template for the README.md file. Conditionally renders optional sections if user input is provided.
const generateREADME = ({
	title,
	description,
	installation,
	usage,
	contributing,
	test,
	license,
	username,
	email,
}) => `# ${title}
${generateLicenseBadge(license, licenseObj[license].color)}

## Description
${description}

## Table of Contents
${installation ? "- [Installation](#installation)" : ""}
${usage ? "- [Usage](#usage)" : ""}
${contributing ? "- [Contributing](#contributing)" : ""}
${test ? "- [Tests](#tests)" : ""}
${username || email ? "- [Questions](#questions)" : ""}
${license ? "- [License](#license)" : ""}

${installation ? generateSection("Installation", installation) : ""}

${usage ? generateSection("Usage", usage) : ""}

${contributing ? generateSection("Contributing", contributing) : ""}

${test ? generateSection("Tests", test) : ""}

${username || email ? generateQuestionsSection(username, email) : ""}

## License
[${license}](${generateLicenseUrl(licenseObj[license].path)})
`;

// Initializes application
const init = async () => {
	try {
		const answers = await promptUser();

		const readme = generateREADME(answers);

		await writeFileAsync("README.md", readme);

		console.log("Successfully wrote to README.md");
	} catch (err) {
		console.log(err);
	}
};

init();
