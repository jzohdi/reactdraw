import React from "react";
import { Story } from "@storybook/react";
import Button from "../components/Button";

export default {
  title: "Example/Button",
  component: Button,
};

const Template: Story<{}> = (args) => <Button {...args} />;

export const Primary = Template.bind({});
