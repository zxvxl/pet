import { mysqlHealthCheck } from './mysql-health';
import * as mysql from 'mysql2/promise';

jest.mock('mysql2/promise');
const mockCreate = mysql.createConnection as jest.Mock;

const mockConn = {
  execute: jest.fn().mockResolvedValue([]),
  end: jest.fn().mockResolvedValue(undefined),
};

mockCreate.mockResolvedValue(mockConn);

describe('mysql health check', () => {
  it('should execute simple query', async () => {
    await expect(mysqlHealthCheck()).resolves.toBe(true);
    expect(mockCreate).toBeCalled();
    expect(mockConn.execute).toBeCalledWith('SELECT 1');
    expect(mockConn.end).toBeCalled();
  });
});
