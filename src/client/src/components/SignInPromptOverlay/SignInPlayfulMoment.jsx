import PropTypes from 'prop-types';
import Lottie from 'lottie-react';

const SignInPlayfulMoment = ({ scene, compact = false }) => {
  if (!scene) {
    return null;
  }

  const isImage = scene.kind === 'image' && scene.imageSrc;

  return (
    <div
      className={`sign-in-playful-moment${compact ? ' sign-in-playful-moment--compact' : ''}${isImage ? ' sign-in-playful-moment--scene' : ''}`}
      aria-hidden="true"
    >
      <div className="sign-in-playful-moment__stage">
        {isImage ? (
          <img
            className="sign-in-playful-moment__scene-img"
            src={scene.imageSrc}
            alt=""
          />
        ) : (
          scene.animationData && (
            <Lottie
              animationData={scene.animationData}
              loop
              className="sign-in-playful-moment__lottie"
            />
          )
        )}
      </div>
      {scene.caption ? (
        <p className="sign-in-playful-moment__caption">{scene.caption}</p>
      ) : null}
    </div>
  );
};

SignInPlayfulMoment.propTypes = {
  scene: PropTypes.shape({
    id: PropTypes.string.isRequired,
    caption: PropTypes.string,
    kind: PropTypes.oneOf(['lottie', 'image']),
    animationData: PropTypes.object,
    imageSrc: PropTypes.string,
  }),
  compact: PropTypes.bool,
};

export default SignInPlayfulMoment;
