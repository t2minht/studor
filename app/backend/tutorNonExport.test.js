process.env.NODE_ENV = 'TEST';

const tutoring = require('./tutoring-backend');
describe('convertTo12HourFormat', () => {
    test('Converts morning times (AM)', () => {
        expect(tutoring.convertTo12HourFormat('08:30')).toBe('8:30 AM');
    });

    test('Converts afternoon times (PM)', () => {
        expect(tutoring.convertTo12HourFormat('15:45')).toBe('3:45 PM');
    });

    test('Converts midnight (12:00 AM)', () => {
        expect(tutoring.convertTo12HourFormat('00:00')).toBe('12:00 AM');
    });

    test('Converts noon (12:00 PM)', () => {
        expect(tutoring.convertTo12HourFormat('12:00')).toBe('12:00 PM');
    });

    test('Converts times with single-digit minutes', () => {
        expect(tutoring.convertTo12HourFormat('09:05')).toBe('9:05 AM');
    });

    test('Converts times with leading zeros in hours', () => {
        expect(tutoring.convertTo12HourFormat('03:20')).toBe('3:20 AM');
    });

    test('Converts times with leading zeros in minutes', () => {
        expect(tutoring.convertTo12HourFormat('14:09')).toBe('2:09 PM');
    });
});

// describe('formatDate', () => {
//     test('Formats a standard date', () => {
//         expect(tutoring.formatDate('2024-04-25')).toBe('April 25, 2024');
//     });

//     test('Formats a date with leading zeros in the day or month', () => {
//         expect(tutoring.formatDate('2024-04-05')).toBe('April 05, 2024');
//     });

//     test('Formats a date with different locales', () => {
//         // Example of how you might test with a different locale
//         const formattedDate = tutoring.formatDate('2024-04-25');
//         expect(formattedDate).toBe('April 25, 2024');
//     });

//     test('Formats a date at the end of the month', () => {
//         // Example of testing a date at the end of the month
//         expect(tutoring.formatDate('2024-04-30')).toBe('April 30, 2024');
//     });

//     test('Formats a date at the end of the year', () => {
//         // Example of testing a date at the end of the year
//         expect(tutoring.formatDate('2024-12-31')).toBe('December 31, 2024');
//     });
// });

describe('setDifference', () => {
    test('Difference between sets with different elements', () => {
        const setA = new Set([1, 2, 3]);
        const setB = new Set([4, 5, 6]);
        expect(tutoring.setDifference(setA, setB)).toEqual(new Set([1, 2, 3]));
    });

    test('Difference between sets with some overlapping elements', () => {
        const setA = new Set([1, 2, 3, 4]);
        const setB = new Set([3, 4, 5, 6]);
        expect(tutoring.setDifference(setA, setB)).toEqual(new Set([1, 2]));
    });

    test('Difference between sets where one set is a subset of the other', () => {
        const setA = new Set([1, 2, 3]);
        const setB = new Set([2]);
        expect(tutoring.setDifference(setA, setB)).toEqual(new Set([1, 3]));
    });

    test('Difference between two empty sets', () => {
        const setA = new Set();
        const setB = new Set();
        expect(tutoring.setDifference(setA, setB)).toEqual(new Set());
    });

    test('Difference between a non-empty set and an empty set', () => {
        const setA = new Set([1, 2, 3]);
        const setB = new Set();
        expect(tutoring.setDifference(setA, setB)).toEqual(new Set([1, 2, 3]));
    });

    test('Difference between two sets with non-primitive elements', () => {
        const obj1 = { id: 1 };
        const obj2 = { id: 2 };
        const obj3 = { id: 3 };
        const setA = new Set([obj1, obj2, obj3]);
        const setB = new Set([obj2]);
        expect(tutoring.setDifference(setA, setB)).toEqual(new Set([obj1, obj3]));
    });

});


jest.mock('@sendgrid/mail');
const sgMail = require('@sendgrid/mail');
beforeAll(() => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
});
beforeEach(() => {
    sgMail.send = jest.fn().mockImplementation(() => Promise.resolve({}));


});

afterEach(() => {
    jest.clearAllMocks();
});

describe('sendEmailOnUpdate', () => {
    test('Sends email with correct session info', () => {
        // Mock sessionInfo object
        const sessionInfo = {
            title: 'Sample Session',
            description: 'Sample description',
            department: 'Sample Department',
            courseNumber: '101',
            courseSection: 'A',
            location: 'Sample Location',
            date: '2024-04-25',
            startTime: '09:00',
            endTime: '11:00',
            groupSize: 5,
        };


        const formatDate = jest.fn();
        const convertTo12HourFormat = jest.fn();
        formatDate.mockReturnValue('April 25, 2024');
        convertTo12HourFormat.mockReturnValue('9:00 AM');

        // Call the function
        tutoring.sendEmailOnUpdate('participant@example.com', sessionInfo);

        // Verify that sgMail.send was called with the correct parameters
        expect(sgMail.send).toHaveBeenCalledWith({
            to: 'participant@example.com',
            from: 'studorcapstone@gmail.com',
            subject: 'One Of Your Tutoring Sessions Has Been Updated!',
            html: expect.stringContaining('Sample Session'),
        });
    });
});

describe('sendEmailOnDelete', () => {
    test('Sends email on delete - Success', async () => {
        // Mock sessionInfo object
        const sessionInfo = {
            title: 'Sample Session',
            description: 'Sample description',
            department: 'Sample Department',
            course_number: '101', // Changed to match the key in the template string
            section: 'A', // Changed to match the key in the template string
            location: 'Sample Location',
            date: '2024-04-25',
            start_time: '09:00', // Changed to match the key in the template string
            end_time: '11:00', // Changed to match the key in the template string
            max_group_size: 5 // Changed to match the key in the template string
        };

        // Call the function and await its result
        await tutoring.sendEmailOnDelete('participant@example.com', sessionInfo);

        // Verify that sgMail.send was called with the correct parameters
        expect(sgMail.send).toHaveBeenCalledWith(expect.objectContaining({
            to: 'participant@example.com',
            from: 'studorcapstone@gmail.com',
            subject: 'One Of Your Tutoring Sessions Has Been Deleted!',
        }));
    });
});

