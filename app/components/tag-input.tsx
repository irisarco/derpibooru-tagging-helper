import { useAutocomplete } from "@/utils/local-autocomplete";
import React, { useState } from "react";
import { Combobox } from "@headlessui/react";

export interface TagInputProps {
  onAdd: (tag: string) => void;
  onDeletePrevious?: () => void;
}

export const TagInput: React.FC<TagInputProps> = ({
  onAdd,
  onDeletePrevious,
}) => {
  const [query, setQuery] = useState("");
  const suggestions = useAutocomplete(query);

  return (
    <Combobox
      as="div"
      className="relative leading-[1.15]"
      onChange={(tag: string) => {
        onAdd(tag);
        setQuery("");
      }}
      onKeyDown={(e) => {
        if (e.key === "Backspace" && query.length === 0) {
          onDeletePrevious?.();
        }
      }}
    >
      <Combobox.Input
        placeholder="add a tag"
        className="border border-[#5f636a] bg-[#272d38] p-5px text-sm leading-[inherit] placeholder:text-inherit placeholder:opacity-[54%] focus:border-[#647493] focus:bg-[#313947] focus:outline-none"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <Combobox.Options className="absolute left-0 top-0 mt-8 max-w-xs whitespace-nowrap bg-[#546c99] text-[13px]">
        {query.length > 0 && (
          <Combobox.Option
            value={query}
            className="cursor-pointer overflow-hidden text-ellipsis p-5px ui-active:bg-[#e0e0e0] ui-active:text-[#546c99]"
          >
            {query}
          </Combobox.Option>
        )}
        {suggestions.map((tag) => (
          <Combobox.Option
            key={tag.name}
            value={tag.name}
            className="cursor-pointer overflow-hidden p-5px ui-active:bg-[#e0e0e0] ui-active:text-[#546c99]"
          >
            {tag.name} ({tag.imageCount})
          </Combobox.Option>
        ))}
      </Combobox.Options>
    </Combobox>
  );
};
