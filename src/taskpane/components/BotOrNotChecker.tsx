import { DefaultButton, Icon, Text } from "@fluentui/react";
import * as React from "react";
import styled from "styled-components";
import { RoughNotation } from "react-rough-notation";

/* global Word, console, OfficeExtension, fetch, JSX */

export interface BotOrNotResults {
  overall: Overall[];
  perplexity: Perplexity;
  sentences: [Sentence[], string][];
}

export interface Overall {
  label: string;
  score: number;
}

export interface Perplexity {
  gpt2: number;
}

export interface Sentence {
  label: string;
  score: number;
}

function BotOrNotChecker() {
  enum BotOrNot {
    Bot,
    NotBot,
  }

  interface BotOrNotSentence {
    text: string;
    result: BotOrNot;
  }

  const [isBotOrNot, setIsBotOrNot] = React.useState<BotOrNot>(undefined);
  const [resultSentences, setResultSentences] = React.useState<BotOrNotSentence[]>([]);
  const [isChecking, setIsChecking] = React.useState(false);
  const [error, setError] = React.useState<string | undefined>(undefined);

  async function getSelectedText(): Promise<string> {
    return Word.run(async (context) => {
      const doc = context.document;
      const originalRange = doc.getSelection();
      originalRange.load("text");
      await context.sync();

      return originalRange.text;
    }).catch(function (error) {
      console.error("Error: " + error);
      if (error instanceof OfficeExtension.Error) {
        console.error("Debug info: " + JSON.stringify(error.debugInfo));
      }
      setError(error);

      return "";
    });
  }

  function isBotOrNotOverall(results: BotOrNotResults): BotOrNot {
    const overall = results.overall[0];
    const perplexity = results.perplexity.gpt2;

    if (overall.label.toLowerCase() !== "human" && (overall.score >= 0.98 || perplexity < 30)) {
      return BotOrNot.Bot;
    }

    return BotOrNot.NotBot;
  }

  function extractSentences(results: BotOrNotResults): BotOrNotSentence[] {
    const botOrNotSentences: BotOrNotSentence[] = [];
    const sentences = results.sentences;

    sentences.forEach(([sentence, text]) => {
      const strong = sentence[0].score > 0.996;
      const isBot = sentence[0].label.toLowerCase() !== "human";

      const botOrNotSentence: BotOrNotSentence = {
        text: text,
        result: isBot && strong ? BotOrNot.Bot : BotOrNot.NotBot,
      };
      botOrNotSentences.push(botOrNotSentence);
    });

    return botOrNotSentences;
  }

  async function checkSelectedText() {
    setError(undefined);
    setIsChecking(true);
    setIsBotOrNot(undefined);
    setResultSentences([]);

    const selectedText = await getSelectedText();

    const options: RequestInit = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        msg: selectedText,
      }),
    };

    const url = "http://localhost:3001/calc";

    const data = await fetch(url, options)
      .then((response) => {
        console.log(response);
        if (!response.ok || response.status !== 200) {
          throw "Error: " + response.status + " - " + response.statusText + "";
        }
        return response.json();
      })
      .then((data) => {
        return data.result as BotOrNotResults;
      })
      .catch((error) => {
        console.error(error);
        setError(error);
      });

    if (data) {
      setIsBotOrNot(isBotOrNotOverall(data));
      setResultSentences(extractSentences(data));
    }
    setIsChecking(false);
  }

  const ThinkingIcon = () => <Icon iconName="EmojiNeutral" />;
  const BotIcon = () => <Icon iconName="Robot" />;
  const HumanIcon = () => <Icon iconName="Emoji" />;

  const IconsAndTextWrapper = styled.section`
    padding: 1em;
    display: flex;
  `;

  const IconsAndTextTextStyle = styled(Text)`
    padding-left: 1em;
  `;

  function IconAndText({ children, text }: { children: JSX.Element; text: string }): JSX.Element {
    return (
      <IconsAndTextWrapper style={{ fontSize: 24 }}>
        {children}
        <IconsAndTextTextStyle variant="large">{text}</IconsAndTextTextStyle>
      </IconsAndTextWrapper>
    );
  }

  function SentenceWithResult({
    children,
    text,
    botOrNot,
  }: {
    children: JSX.Element;
    text: string;
    botOrNot: BotOrNot;
  }): JSX.Element {
    return (
      <IconsAndTextWrapper style={{ fontSize: 18 }}>
        <RoughNotation
          type={botOrNot === BotOrNot.Bot ? "box" : "circle"}
          color={botOrNot === BotOrNot.Bot ? "#b21f1f" : "#fdbb2d"}
          show={true}
        >
          {children}
          <IconsAndTextTextStyle variant="large">{text}</IconsAndTextTextStyle>
        </RoughNotation>
      </IconsAndTextWrapper>
    );
  }

  const Wrapper = styled.section`
    padding: 1em;
  `;

  const InstructionWrapper = styled.section`
    font-size: 1.2em;
    padding: 1em;
    display: flex;
    height: 50px;
    align-items: center;
  `;

  const ErrorText = styled.section`
    font-size: 1.2em;
    padding: 1em;
    color: red;
  `;

  return (
    <Wrapper>
      <InstructionWrapper>
        <DefaultButton disabled={isChecking} onClick={checkSelectedText}>
          Check if a bot wrote selected text
        </DefaultButton>
      </InstructionWrapper>
      {error && <ErrorText>{error}</ErrorText>}
      {!error && (
        <>
          {isChecking && (
            <IconAndText text="Checking...">
              <ThinkingIcon />
            </IconAndText>
          )}
          {isBotOrNot === BotOrNot.Bot && (
            <IconAndText text="Might be a Bot!">
              <BotIcon />
            </IconAndText>
          )}
          {isBotOrNot === BotOrNot.NotBot && (
            <IconAndText text="Probably a Human!">
              <HumanIcon />
            </IconAndText>
          )}

          {resultSentences.length > 0 && <Text variant="large">Sentences:</Text>}

          {resultSentences.map((sentence, ix) => {
            return (
              <SentenceWithResult key={ix} text={sentence.text} botOrNot={sentence.result}>
                {sentence.result === BotOrNot.Bot ? <BotIcon /> : <HumanIcon />}
              </SentenceWithResult>
            );
          })}
        </>
      )}
    </Wrapper>
  );
}

export default BotOrNotChecker;
