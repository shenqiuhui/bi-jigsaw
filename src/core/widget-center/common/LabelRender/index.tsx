import './index.less'

interface ILabelRenderProps {
  name: string;
}

const LabelRender: React.FC<ILabelRenderProps> = (props) => {
  const { name } = props;

  return (
    <span className="item-color">{name}</span>
  );
}

export default LabelRender;
