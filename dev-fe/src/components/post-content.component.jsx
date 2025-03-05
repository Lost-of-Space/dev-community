const Img = ({ url, caption }) => {
  return (
    <div className="my-4">
      <img className="max-h-[400px] rounded-xl" src={url} alt={caption.length ? caption : ""} />
      {caption.length ? <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">{caption}</p> : ""}
    </div>
  );
};

const Quote = ({ quote, caption }) => {
  return (
    <div className="bg-royalblue/10 p-3 pl-5 my-4 border-l-4 border-royalblue rounded">
      <p className="text-xl leading-10 md:text-2xl">{quote}</p>
      {caption.length ? <p className="w-full text-base text-royalblue">{caption}</p> : ""}
    </div>
  );
};

const List = ({ style, items }) => {
  return (
    <ol className={`pl-5 ${style === "ordered" ? " list-decimal" : " list-disc"}`}>
      {items.map((listItem, i) => (
        <li key={i} className="my-4" dangerouslySetInnerHTML={{ __html: listItem }}></li>
      ))}
    </ol>
  );
};

const Video = ({ embed, caption }) => {
  return (
    <div className="my-4">
      <div className="aspect-w-16 aspect-h-9">
        <iframe
          className="w-full h-[450px] rounded-xl max-sm:h-[250px]"
          src={embed}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={caption.length ? caption : ""}
        ></iframe>
      </div>
      {caption.length ? <p className="w-full text-center my-3 md:mb-12 text-base text-dark-grey">{caption}</p> : ""}
    </div>
  );
};

const PostContent = ({ block }) => {
  let { type, data } = block;

  if (type === "paragraph") {
    return <p className="paragraph" dangerouslySetInnerHTML={{ __html: data.text }}></p>;
  }
  if (type === "header") {
    if (data.level === 3) {
      return <h3 className="text-2xl font-bold" dangerouslySetInnerHTML={{ __html: data.text }}></h3>;
    }
    if (data.level === 2) {
      return <h3 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: data.text }}></h3>;
    }
    if (data.level === 1) {
      return <h3 className="text-4xl font-bold" dangerouslySetInnerHTML={{ __html: data.text }}></h3>;
    }
  }
  if (type === "image") {
    return <Img url={data.file.url} caption={data.caption} />;
  }
  if (type === "quote") {
    return <Quote quote={data.text} caption={data.caption} />;
  }
  if (type === "list") {
    return <List style={data.style} items={data.items} />;
  }
  if (type === "embed") {
    return <Video embed={data.embed} caption={data.caption} />;
  }
  return <h1>Error: Unknown Block Type</h1>;
};

export default PostContent;