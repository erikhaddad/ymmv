import { YmmvPage } from './app.po';

describe('ymmv App', () => {
  let page: YmmvPage;

  beforeEach(() => {
    page = new YmmvPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
