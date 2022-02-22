import { LogLevel } from '@nestjs/common/services/logger.service';

function getLogLevels(isProduction: boolean): LogLevel[] {
  if (isProduction) {
    return ['warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
}

export default getLogLevels;
