import './index.less'

interface LabelRenderProps {
  name: string;
}

const LabelRender: React.FC<LabelRenderProps> = (props) => {
  const { name } = props;

  return (
    <span className="item-color">
      {name}
    </span>
  );
}

export default LabelRender;
