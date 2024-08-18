/* eslint-disable @typescript-eslint/no-floating-promises */
import app from './app';
import { Config } from './config';
import { AppDataSource } from './config/data-source';
import logger from './config/logger';

const startServer = async () => {
    try {
        const Port = Config.PORT;
        await AppDataSource.initialize();
        logger.info('Database Connected Successfully');
        app.listen(Port, () => logger.info('listening on port ' + Port));
    } catch (error: unknown) {
        if (error instanceof Error) logger.error(error.message);
        process.exit(1);
    }
};

startServer();
