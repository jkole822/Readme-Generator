const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

// GIVEN a command-line application that accepts user input

// WHEN I am prompted for information about my application repository
// THEN a high-quality, professional README.md is generated with the title of my project and sections entitled Description, Table of Contents,
//     Installation, Usage, License, Contributing, Tests, and Questions

// WHEN I enter my project title
// THEN this is displayed as the title of the README

// WHEN I enter a description, installation instructions, usage information, contribution guidelines, and test instructions
// THEN this information is added to the sections of the README entitled Description, Installation, Usage, Contributing, and Tests

// WHEN I choose a license for my application from a list of options
// THEN a badge for that license is added near the top of the README and a notice is added to the section of the README entitled License
//     that explains which license the application is covered under

// WHEN I enter my GitHub username
// THEN this is added to the section of the README entitled Questions, with a link to my GitHub profile

// WHEN I enter my email address
// THEN this is added to the section of the README entitled Questions, with instructions on how to reach me with additional questions

// WHEN I click on the links in the Table of Contents
// THEN I am taken to the corresponding section of the README

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

const generateSection = (header, info) => {
	return `## ${header}
${info}`;
};

const generateQuestionsSection = (username, email) => {
	let emailLine;
	let usernameLine;

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

const generateLicenseBadge = (license, color) =>
	`![license](https://img.shields.io/static/v1?label=license&message=${encodeURIComponent(
		license
	)}&color=${color}&style=for-the-badge)`;

const generateLicenseUrl = licensePath =>
	`https://choosealicense.com/licenses/${licensePath}`;

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
