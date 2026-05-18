// src/components/UIComponents.jsx

/* =========================================================
   PRIMARY BUTTON
========================================================= */
export function PrimaryButton({
  text,
  onClick,
  type = "button"
}) {
  return (
    <button
      type={type}
      className="primary-btn"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

/* =========================================================
   STATS CARD
========================================================= */
export function StatsCard({
  title,
  value,
  color = "blue"
}) {
  return (
    <div className={`stat-card ${color}`}>

      <h2>{value}</h2>

      <p>{title}</p>

    </div>
  );
}

/* =========================================================
   SUBJECT CARD
========================================================= */
export function SubjectCard({
  title,
  description,
  badge
}) {
  return (
    <div className="subject-card">

      <h3>{title}</h3>

      <p>{description}</p>

      {badge && (
        <span className="badge">
          {badge}
        </span>
      )}

    </div>
  );
}

/* =========================================================
   MATERIAL CARD
========================================================= */
export function MaterialCard({
  title,
  buttonText = "Download",
  onClick
}) {
  return (
    <div className="material-card">

      <div className="material-icon">
        📘
      </div>

      <h3>{title}</h3>

      <button
        className="primary-btn"
        onClick={onClick}
      >
        {buttonText}
      </button>

    </div>
  );
}

/* =========================================================
   MARKETPLACE CARD
========================================================= */
export function MarketplaceCard({
  image,
  title,
  description,
  price,
  buttonText = "Buy Now",
  onClick
}) {
  return (
    <div className="market-card">

      <img
        src={image}
        alt={title}
      />

      <h3>{title}</h3>

      <p>{description}</p>

      <h2>KES {price}</h2>

      <button
        className="primary-btn"
        onClick={onClick}
      >
        {buttonText}
      </button>

    </div>
  );
}

/* =========================================================
   TABLE COMPONENT
========================================================= */
export function Table({
  headers = [],
  data = []
}) {
  return (
    <div className="table-container">

      <table>

        <thead>

          <tr>

            {headers.map((header, index) => (
              <th key={index}>
                {header}
              </th>
            ))}

          </tr>

        </thead>

        <tbody>

          {data.map((row, index) => (

            <tr key={index}>

              {Object.values(row).map((value, i) => (
                <td key={i}>
                  {value}
                </td>
              ))}

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

/* =========================================================
   NOTIFICATION CARD
========================================================= */
export function NotificationCard({
  message
}) {
  return (
    <div className="notification-card">
      {message}
    </div>
  );
}

/* =========================================================
   PROFILE CARD
========================================================= */
export function ProfileCard({
  image,
  name,
  role,
  email,
  phone
}) {
  return (
    <div className="profile-card">

      <img
        src={image}
        alt={name}
      />

      <h2>{name}</h2>

      <p>{role}</p>

      <table>

        <tbody>

          <tr>
            <td>Email</td>
            <td>{email}</td>
          </tr>

          <tr>
            <td>Phone</td>
            <td>{phone}</td>
          </tr>

        </tbody>

      </table>

    </div>
  );
}

/* =========================================================
   CHAT MESSAGE
========================================================= */
export function ChatMessage({
  text,
  side = "left"
}) {
  return (
    <div className={`message ${side}`}>
      {text}
    </div>
  );
}

/* =========================================================
   SETTING ITEM
========================================================= */
export function SettingItem({
  title,
  description
}) {
  return (
    <div className="setting-item">

      <div>

        <h4>{title}</h4>

        <p>{description}</p>

      </div>

      <input type="checkbox" />

    </div>
  );
}

/* =========================================================
   PAGE HEADER
========================================================= */
export function PageHeader({
  title,
  subtitle,
  buttonText,
  onClick
}) {
  return (
    <div className="page-header">

      <div>

        <h1>{title}</h1>

        <p>{subtitle}</p>

      </div>

      {buttonText && (
        <button
          className="primary-btn"
          onClick={onClick}
        >
          {buttonText}
        </button>
      )}

    </div>
  );
}