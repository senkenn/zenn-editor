import { parse } from 'node-html-parser';
import markdownToHtml from '../../src/index';

describe('SpeakerDeck埋め込み要素のテスト', () => {
  const validToken = 'example-token';
  const invalidToken = '@invalid-token';

  describe('デフォルトの挙動の場合', () => {
    test('@[speakerdeck](...)を<iframe />に変換する', () => {
      const html = markdownToHtml(`@[speakerdeck](${validToken})`);
      const iframe = parse(html).querySelector(`span.embed-speakerdeck iframe`);

      expect(iframe?.attributes).toEqual(
        expect.objectContaining({
          src: `https://speakerdeck.com/player/${validToken}`,
        })
      );
    });

    describe('無効なURLの場合', () => {
      test('エラーメッセージを出力する', () => {
        const html = markdownToHtml(`@[speakerdeck](${invalidToken})`);
        expect(html).toContain('Speaker Deckのkeyが不正です');
      });
    });
  });

  describe('`customEmbed.speakerdeck()`を設定している場合', () => {
    test('渡した関数を実行する', () => {
      const customizeText = 'customized text!';
      const mock = jest.fn().mockReturnValue(customizeText);
      const html = markdownToHtml(`@[speakerdeck](${validToken})`, {
        customEmbed: { speakerdeck: mock },
      });

      expect(mock).toBeCalled();
      expect(html).toContain(customizeText);
    });
  });
});
