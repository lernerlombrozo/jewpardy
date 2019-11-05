import { EmailNamePipe } from './email-name.pipe';

describe('EmailNamePipe', () => {
  it('create an instance', () => {
    const pipe = new EmailNamePipe();
    expect(pipe).toBeTruthy();
  });
});
