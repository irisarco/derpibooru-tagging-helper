import clsx from "clsx";
import React from "react";

export interface DescriptionProps {
  className?: string;
}

export const Description: React.FC<DescriptionProps> = ({ className }) => {
  return (
    <div className={clsx("space-y-1.5 text-sm", className)}>
      <p>
        Have you tried uploading an image but you didn&apos;t know which tags to
        use? Or maybe you wanted to get more tags? <br />
        If yes, then this tool might be helpful for you.
      </p>
      <p>
        <b>How to use: </b>
        Simply enter your tags and press &quot;Load related&quot; button and
        click on the tags you want to add. Repeat until you are satisfied with
        the results. You can also paste tags copied from the site.
      </p>
      <p>
        <b>How it works: </b>
        It looks for images tagged with as many tags you provided as possible
        and then lists the most popular tags you haven&apos;t used.
      </p>
    </div>
  );
};
