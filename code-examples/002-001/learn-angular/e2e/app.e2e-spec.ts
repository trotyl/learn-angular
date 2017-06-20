import { LearnAngularPage } from './app.po';

describe('learn-angular App', () => {
  let page: LearnAngularPage;

  beforeEach(() => {
    page = new LearnAngularPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
