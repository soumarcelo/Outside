import { EventCardProps } from "@/app/lib/definitions/props";

const cardWidth: string = "250px";
const cardHeight: string = "125px";

export default function EventCard(props : EventCardProps) {
  return (
      <div className="card bg-transparent shadow-sm" style={{ width: cardWidth, height: cardHeight}}>
        <img className="card-img" src={props.eventImageURL} width={cardWidth} height={cardHeight} />
        <a className="btn card-img-overlay vstack" onClick={props.onClick}>
          <p className="card-title fs-6 fw-bolder text-truncate text-start text-white text-opacity-75 h-100">{props.eventName}</p>
          <p className="card-text fs-2 fw-bolder text-end text-white text-opacity-75 h-100">{props.eventDay}/{props.eventMonth}</p>
        </a>
      </div>
  );
}