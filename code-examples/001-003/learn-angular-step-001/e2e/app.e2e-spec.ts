import { LearnAngularPage } from './app.po';

describe('learn-angular App', () => {
  let page: LearnAngularPage;

  beforeEach(() => {
    page = new LearnAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
