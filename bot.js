// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ActivityHandler, MessageFactory, CardFactory } = require('botbuilder');

class OneStopBot extends ActivityHandler {
	constructor() {
		super();

		this.state = {};

		this.setState = this.setState.bind(this);
		this.firstInteraction = true;

		this.onMembersAdded(async (context, next) => {
			const membersAdded = context.activity.membersAdded;
			for (let cnt = 0; cnt < membersAdded.length; ++cnt) {
				if (membersAdded[cnt].id !== context.activity.recipient.id) {
					var reply = MessageFactory.suggestedActions(
						['How do I apply?', 'Can I schedule a visit?', 'Can you tell me more about PC?'],
						'Hi! Thanks for reaching out? How can I help you?'
					);

					await context.sendActivity(reply);
				}
			}
			// By calling next() you ensure that the next BotHandler is run.
			await next();
		});

		const handleMessage = this.handleMessage;
		let firstInteraction = this.firstInteraction;

		this.onTurn(async (context, next) => {
			if (context.activity.type === 'message') {
				const message = context.activity.text;

				if (firstInteraction) {
					if (message.toLowerCase().search('apply') > 0 || message.toLowerCase().search('application') > 0) {
						await handleMessage('How do I apply?', context);
					}

					var reply = MessageFactory.suggestedActions(
						['How do I apply?', 'Can I schedule a visit?', 'Can you tell me more about PC?'],
						'Hi! Thanks for reaching out? How can I help you?'
					);

					firstInteraction = false;

					await context.sendActivity(reply);
				} else {
					this.handleMessage(message, context);
				}
			}
			await next();
		});
	}

	setState(state) {
		this.state = state;
	}

	async handleMessage(message, turnContext) {
		let reply = "Sorry, I didn't quite understand. Let's connect in person.";
		let answered = false;

		if (message == 'Go back') {
			reply = MessageFactory.suggestedActions(
				['How do I apply?', 'Can I schedule a visit?', 'Can you tell me more about PC?'],
				'Sure! How can I help you?'
			);

			await turnContext.sendActivity(reply);
		}

		if (message == 'How do I apply?') {
			//his.student.lookingForAdmissionInformation = true;
			answered = true;
			reply = MessageFactory.suggestedActions(
				['Undergraduate', 'Transfer', 'Graduate', 'Continuing Education'],
				'Sure, I can help you with that. Can you tell me what kind of application information you think you need?'
			);

			await turnContext.sendActivity(reply);
			next();
		}

		if (message == 'Undergraduate' /*&& this.student.lookingForAdmissionInformation*/) {
			answered = true;
			await this.undergraduateAdmission(turnContext);
		}

		if (message == 'Undergraduate academics' /* && this.student.lookingForAcademicInformation*/) {
			answered = true;
			await this.undergraduateAcademics(turnContext);
		}

		if (message == 'Graduate academics' /* && this.student.lookingForAcademicInformation*/) {
			answered = true;
			await this.graduateAcademics(turnContext);
		}

		if (message == 'Continuing education academics' /* && this.student.lookingForAcademicInformation*/) {
			answered = true;
			await this.sceAcademics(turnContext);
		}

		if (message == 'Can I schedule a visit?') {
			answered = true;
			reply = MessageFactory.suggestedActions(
				[
					'Take part in a student-led campus tour.',
					'Attend an information session to learn more about all aspects of the College, including financial aid and the admission process.',
				],
				'The best way to understand what it is like to live and learn at Providence College is to visit. If you are a prospective student, the Office of Admission offers a variety of ways to become familiar with the PC campus.'
			);

			await turnContext.sendActivity(reply);
		}

		if (message == 'Can you tell me more about PC?') {
			answered = true;
			//this.student.lookingForAcademicInformation = true;
			reply = MessageFactory.suggestedActions(
				['Undergraduate academics', 'Graduate academics', 'Continuing education academics'],
				'Sure! What do you want more information on?'
			);

			await turnContext.sendActivity(reply);
		}

		if (!answered) {
			turnContext.sendActivity(reply);
		}
	}
	async graduateAcademics(turnContext) {
		const reply = CardFactory.thumbnailCard(
			'More information about Undergraduate Academics',
			[
				{
					url:
						'https://cpb-us-e1.wpmucdn.com/sites.providence.edu/dist/1/6/files/2018/11/undergraduate-tab-135y77q.jpg',
				},
			],
			[
				{
					type: 'openUrl',
					title: 'More information',
					value: 'https://academics.providence.edu/departments/graduate-programs/',
				},
			],
			{
				subtitle: '',
				text:
					'At Providence College, you’ll have the opportunity to immerse yourself in a distinctive program of study led by committed teacher-scholars who are experts in their fields. You’ll learn the skills necessary to thrive in a competitive job market and have the support of a passionate alumni network every step of the way. You’ll consider diverse perspectives, tackle challenging philosophical and spiritual questions, and learn what it means to truly be a part of a community. Graduate study at PC doesn’t just prepare you for a successful career; it prepares you for a successful life.',
			}
		);

		await turnContext.sendActivity({ attachments: [reply] });
	}
	async sceAcademics(turnContext) {
		const reply = CardFactory.thumbnailCard(
			'More information about Continuing Education',
			[
				{
					url:
						'https://cpb-us-e1.wpmucdn.com/sites.providence.edu/dist/1/6/files/2018/11/undergraduate-tab-135y77q.jpg',
				},
			],
			[
				{
					type: 'openUrl',
					title: 'More information',
					value: 'https://continuing-education.providence.edu/',
				},
			],
			{
				subtitle: '',
				text:
					'Providence College’s School of Continuing Education provides academic programs designed to meet the educational needs of adult students. The School of Continuing Education offers eight bachelor’s degree programs, two associate’s degree programs, and eight certificate programs.  SCE also offers a joint master’s degree program with the School of Professional Studies in Urban Education and Teacher Certification.',
			}
		);

		await turnContext.sendActivity({ attachments: [reply] });
	}

	async undergraduateAcademics(turnContext) {
		const reply = CardFactory.thumbnailCard(
			'More information about Undergraduate Academics',
			[
				{
					url:
						'https://cpb-us-e1.wpmucdn.com/sites.providence.edu/dist/1/6/files/2018/11/undergraduate-tab-135y77q.jpg',
				},
			],
			[
				{
					type: 'openUrl',
					title: 'More information',
					value: 'https://academics.providence.edu/',
				},
			],
			{
				subtitle: '',
				text:
					'Providence College is a primarily undergraduate, liberal arts, Catholic institution of higher education. Committed to fostering academic excellence through the sciences and humanities, the College provides a variety of opportunities for intellectual, social, moral, and spiritual growth in a supportive environment. PC’s traditional undergraduate academic programs are housed in three schools.',
			}
		);

		await turnContext.sendActivity({ attachments: [reply] });
	}
	async undergraduateAdmission(turnContext) {
		const reply = CardFactory.thumbnailCard(
			'More information about Undergraduate Admission',
			[
				{
					url:
						'https://cpb-us-e1.wpmucdn.com/sites.providence.edu/dist/d/10/files/2018/01/apply-home-banner-20s9gzd.jpg',
				},
			],
			[
				{
					type: 'openUrl',
					title: 'Get started',
					value: 'https://admission.providence.edu/apply/',
				},
			],
			{
				subtitle: 'Our advisors can help you today',
				text:
					'The admission process at PC is highly selective. For the Class of 2022, over 11,400 students applied for approximately 1,000 spaces. It is important that you spend time carefully preparing your application and presenting the most complete portrait of yourself.',
			}
		);

		await turnContext.sendActivity({ attachments: [reply] });
	}
}

module.exports.OneStopBot = OneStopBot;
