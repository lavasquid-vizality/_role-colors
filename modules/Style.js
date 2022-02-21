export default (res, color, style) => {
  if (!res) return;

  res.props.style = {
    ...res.props.style,
    color,
    ...style
  };
};
