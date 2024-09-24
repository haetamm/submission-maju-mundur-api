import dotenv from 'dotenv';
dotenv.config();

import Web from "./application/web.js";
import { logger } from "./application/logging.js";

const port = process.env.PORT || 6000;
const app = new Web();

app.listen(port, () => {
    logger.info(`App use port ${port}`);
});