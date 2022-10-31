const { StatusCodes } = require("http-status-codes");
const prisma = require("../utils/prisma");

const Node = require("../models/Node");

exports.getNodeNames = async (req, res) => {
	let nodes = await prisma.nodes.findMany({
		select: {
			PNODE_NAME: true,
		},
		distinct: ["PNODE_NAME"],
	});
	nodes = nodes.map((node) => node.PNODE_NAME);
	res.status(StatusCodes.OK).json({ data: { nodes } });
};

exports.getScenarios = async (req, res) => {
	let scenarios = await prisma.scenarios.findMany({});
	scenarios = scenarios.map((s) => ({
		SCENARIO_ID: s.SCENARIO_ID,
		SCENARIO_NAME: s.SCENARIO_NAME,
	}));
	res.status(StatusCodes.OK).json({ data: { scenarios } });
};

exports.getNode = async (req, res) => {
	console.log(req.query);
	const { PNODE_NAME, SCENARIO_ID_1, SCENARIO_ID_2, FIELD } = req.query;
	let nodes;

	try {
		nodes = await prisma.nodes.findMany({
			where: {
				PNODE_NAME: PNODE_NAME,
				OR: [
					{ SCENARIO_ID: SCENARIO_ID_1 },
					{ SCENARIO_ID: SCENARIO_ID_2 },
				],
			},
			select: {
				SCENARIO_ID: true,
				PERIOD_ID: true,
				[FIELD]: true,
			},
		});
	} catch (err) {
		res.status(StatusCodes.BAD_REQUEST).json({
			message: err.message,
		});
	}

	res.status(StatusCodes.OK).json({ data: { nodes } });
};
