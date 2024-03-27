import "@/assets/style/tailwind.css";

export default {
  parameters: {
    backgrounds: {
      default: `memotea`,
      values: [
        {
          name: `memotea`,
          value: `linear-gradient(145deg, #d0d0d0, #e7e7e7)`,
        },
      ],
    },
  },
  decorators: [
    () => ({
      template: `<div class="theme-font-color light speed2 text-base">
        <story />
      </div>`,
    }),
  ],
};
