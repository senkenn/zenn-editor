import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Book, ErrorMessage, ErrorMessages } from "@types";
import { getBookErrors } from "@utils/validator";
import ContentWrapper from "@components/ContentWrapper";
import ErrorRow from "@components/ErrorRow";

const BookHeader: React.FC<{ book: Book }> = ({ book }) => {
  const [isCoverRatioError, setIsCoverRatioError] = useState<boolean>(false);
  const isCover = !!book.coverDataUrl;
  const baseErrorMessages = getBookErrors(book);
  const coverRatioError: ErrorMessage = {
    errorType: "critical",
    message:
      "カバー画像の「幅 : 高さ」の比率は「1 : 1.4」にしてください（最終的に幅500px・高さ700pxにリサイズされます）",
  };

  const errorMessages = isCoverRatioError
    ? [coverRatioError, ...baseErrorMessages]
    : baseErrorMessages;
  const errorCount = errorMessages?.length;

  const { asPath } = useRouter();
  const imageRef = useRef(null);
  useEffect(() => {
    if (isCover) validateImageSize(imageRef.current);
  }, [asPath]);

  const validateImageSize = (imageEl: HTMLImageElement): void => {
    const idealApectRatio = 1.4;
    const width = imageEl.naturalWidth;
    const height = imageEl.naturalHeight;
    const aspectRatio = height / width;
    setIsCoverRatioError(Math.abs(aspectRatio - idealApectRatio) > 0.1);
  };

  return (
    <header className="content-header">
      <ContentWrapper>
        {isCover && (
          <div className="content-header__cover">
            <img src={book.coverDataUrl} ref={imageRef} />
          </div>
        )}

        <h1 className="content-header__title">{book.title || "No Title"}</h1>

        <div className="content-header__row">
          <span className="content-header__row-title">slug</span>
          {book.slug}
        </div>

        <div className="content-header__row">
          <span className="content-header__row-title">summary</span>
          {book.summary || "指定が必要です"}
        </div>

        <div className="content-header__row">
          <span className="content-header__row-title">topics</span>
          {Array.isArray(book.topics)
            ? book.topics.map((t, i) => (
                <span className="content-header__topic" key={`bt${i}`}>
                  {t}
                </span>
              ))
            : "指定が必要です"}
        </div>

        {book.public !== undefined && (
          <div className="content-header__row">
            <span className="content-header__row-title">public</span>
            {book.public?.toString()}
            {book.public === false ? "（非公開）" : ""}
          </div>
        )}

        {book.price !== undefined && (
          <div className="content-header__row">
            <span className="content-header__row-title">price</span>
            {book.price?.toString()}
            {book.price === 0 ? "（無料公開）" : ""}
          </div>
        )}

        {!!errorCount && (
          <div>
            <div className="content-header__error-title">
              {errorCount}件のエラー
            </div>
            {errorMessages.map((errorMessage, index) => (
              <ErrorRow errorMessage={errorMessage} key={`invldmsg${index}`} />
            ))}
          </div>
        )}

        <a href="todo" className="content-header__link" target="_blank">
          Bookの作成方法はこちら →
        </a>
      </ContentWrapper>
    </header>
  );
};
export default BookHeader;
