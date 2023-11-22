export type Link = {
  url: string;
  text: string;
  data: {
    title: string;
    summary: string;
    imageUrl: string;
  };
};

export const castLink = (linkData: any): Link => {
  var link = {
    url: linkData.link_context.link_url,
    text: linkData.text,
    data: {
        title: linkData.link_context.link_title,
        summary: linkData.link_context.link_summary,
        imageUrl: linkData.link_context.link_image_url,
    }
  } as Link;

  return link
};
