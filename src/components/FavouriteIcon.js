const style = {
  width: '1rem',
}

export default function FavouriteIcon({ checked, onClick, ...props }) {
  return (
    <div
      {...props}
      role="checkbox"
      alt="Favourite icon"
      tabIndex="0"
      aria-checked={checked}
      onKeyDown={(e) => {
        (e.keyCode === 32 || e.keyCode === 13) && onClick(!checked)
      }}
      onClick={() => onClick(!checked)}
    >
      {
        checked
          ? <svg
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              fill="blueviolet"
              d="M0 48V487.7C0 501.1 10.9 512 24.3 512c5 0 9.9-1.5 14-4.4L192 400 345.7 507.6c4.1 2.9 9 4.4 14 4.4c13.4 0 24.3-10.9 24.3-24.3V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48z"
            />
          </svg>
          : <svg
            style={style}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
          >
            <path
              fill="blueviolet"
              d="M336 0h-288C21.49 0 0 21.49 0 48v431.9c0 24.7 26.79 40.08 48.12 27.64L192 423.6l143.9 83.93C357.2 519.1 384 504.6 384 479.9V48C384 21.49 362.5 0 336 0zM336 452L192 368l-144 84V54C48 50.63 50.63 48 53.1 48h276C333.4 48 336 50.63 336 54V452z"
            />
          </svg>
      }
    </div>
  )
}
