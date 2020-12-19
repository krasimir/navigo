const fs = require('fs');
const path = require('path');

const syncMock = jest.fn(() => {
    return {
        stdout: '1.0.0',
    };
});
jest.setMock('execa', {
    sync: syncMock,
});
const getPackageManager = require('../get-package-manager');

jest.mock('cross-spawn');
const globalModulesNpmValue = 'test-npm';
jest.setMock('global-modules', globalModulesNpmValue);
jest.setMock('enquirer', {
    prompt: jest.fn(),
});

describe('packageUtils', () => {
    describe('getPackageManager', () => {
        const testYarnLockPath = path.resolve(__dirname, 'test-yarn-lock');
        const testNpmLockPath = path.resolve(__dirname, 'test-npm-lock');
        const testBothPath = path.resolve(__dirname, 'test-both');

        const cwdSpy = jest.spyOn(process, 'cwd');

        beforeAll(() => {
            // package-lock.json is ignored by .gitignore, so we simply
            // write a lockfile here for testing
            if (!fs.existsSync(testNpmLockPath)) {
                fs.mkdirSync(testNpmLockPath);
            }
            fs.writeFileSync(path.resolve(testNpmLockPath, 'package-lock.json'), '');
            fs.writeFileSync(path.resolve(testBothPath, 'package-lock.json'), '');
        });

        beforeEach(() => {
            syncMock.mockClear();
        });

        it('should find yarn.lock', () => {
            cwdSpy.mockReturnValue(testYarnLockPath);
            expect(getPackageManager()).toEqual('yarn');
            expect(syncMock.mock.calls.length).toEqual(0);
        });

        it('should find package-lock.json', () => {
            cwdSpy.mockReturnValue(testNpmLockPath);
            expect(getPackageManager()).toEqual('npm');
            expect(syncMock.mock.calls.length).toEqual(0);
        });

        it('should prioritize yarn with many lock files', () => {
            cwdSpy.mockReturnValue(testBothPath);
            expect(getPackageManager()).toEqual('yarn');
            expect(syncMock.mock.calls.length).toEqual(0);
        });

        it('should use yarn if yarn command works', () => {
            // yarn should output a version number to stdout if
            // it is installed
            cwdSpy.mockReturnValue(path.resolve(__dirname));
            expect(getPackageManager()).toEqual('yarn');
            expect(syncMock.mock.calls.length).toEqual(1);
        });

        it('should use npm if yarn command fails', () => {
            syncMock.mockImplementation(() => {
                throw new Error();
            });
            cwdSpy.mockReturnValue(path.resolve(__dirname));
            expect(getPackageManager()).toEqual('npm');
            expect(syncMock.mock.calls.length).toEqual(1);
        });
    });
});
