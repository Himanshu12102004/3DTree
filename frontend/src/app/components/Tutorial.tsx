import React, { useState } from "react";
import { Typewriter } from "react-simple-typewriter";
import Button from "./Button";

const tutorialText = [
  "Welcome to Orbix-22, a breathing planet of glowing trees, shifting gravity, and living crystals. Here time distorts, mists swirl, and the land whispers secrets. Are you ready to explore?",
  "Hello, I am Himanshu, the creator of this strange planet. I will be your guide and help you navigate through its mysteries.",
  "To look around the world, drag your mouse or trackpad in the direction you want to look.",
  "To move forward, press the Up arrow key on your keyboard, to move backward, press the Down arrow key.",
  "This is not a game, but a journey of exploration. There are no enemies or challenges, just the beauty of the world around you.",
];

type TutorialPageProps = {
  text: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  setSeenTutorial: (value: boolean) => void;
};

let currentTypedIndex = 0;

const TutorialPage: React.FC<TutorialPageProps> = ({
  text,
  currentPage,
  setCurrentPage,
  setSeenTutorial,
}) => {
  const [showNextButton, setShowNextButton] = useState(false);
  return (
    <div>
      <div className="absolute top-0 right-0 left-0 bottom-0 backdrop-blur-xs bg-[rgba(0,0,0,0.5)] z-20"></div>
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-40">
        <div
          className=" p-7 max-w-[450px] leading-relaxed text-foreground text-center flex flex-col gap-4"
          style={{ transition: "all 0.5s ease-in-out" }}
        >
          <div>
            <Typewriter
              key={text}
              words={[text]}
              cursor
              cursorStyle="_"
              typeSpeed={30}
              delaySpeed={1000}
              loop={1}
              onType={() => {
                currentTypedIndex++;
                if (currentTypedIndex === text.length - 1) {
                  setTimeout(() => {
                    setShowNextButton(true);
                  }, 500);
                }
              }}
            />
          </div>
          {
            <Button
              text={
                currentPage != tutorialText.length - 1 ? "Next" : "Let's Go"
              }
              shouldShow={showNextButton}
              handler={() => {
                if (currentPage == tutorialText.length - 1) {
                  window.localStorage.setItem("seenTutorial", "Yes");
                  setSeenTutorial(true);
                } else {
                  currentTypedIndex = 0;
                  setCurrentPage(currentPage + 1);
                  setShowNextButton(false);
                }
              }}
            ></Button>
          }
        </div>
      </div>
    </div>
  );
};

type TutorialArgs = {
  seenTutorial: boolean;
  setSeenTutorial: (value: boolean) => void;
};
const Tutorial: React.FC<TutorialArgs> = ({
  seenTutorial,
  setSeenTutorial,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <div>
      {/* <div className="absolute z-30 top-0 left-0 right-0 bottom-0 backdrop-blur-xs"></div> */}
      {!seenTutorial && (
        <TutorialPage
          text={tutorialText[currentPage]}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          setSeenTutorial={setSeenTutorial}
        />
      )}
    </div>
  );
};

export default Tutorial;
