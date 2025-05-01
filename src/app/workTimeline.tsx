import workHistory from '../../work_history.json';

const months = ["January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"];
function formatDate(dateStr: string | undefined) {
    if (!dateStr) {
        return "Present"
    }
    const date = new Date(dateStr)
    return `${months[date.getMonth()]} ${date.getFullYear()}`
}

interface Company {
    name: string;
    startDate: string;
    endDate?: string;
    technologies?: string[];
    title: string;
    formerTitle?: string;
    details?: string
}
function WorkCard(props: {
    company: Company
}) {
    return (
        <section className="work-card">
            <h3 className="work-header">
                <span className="work-header-title">
                    <div>
                        {props.company.title} @ {props.company.name}
                    </div>
                    {props.company.formerTitle && 
                        <div className="light-title">
                            {props.company.formerTitle}
                        </div>
                    }
                </span>
                <span className="work-header-dates">
                    {formatDate(props.company.startDate)} - {formatDate(props.company.endDate)}
                </span>
            </h3>
            <div className="work-description">
                {props.company.details}
            </div>
            <div className="tech-tag-row">
                {props.company.technologies?.map(technology => (
                    <span className="tech-tag">{technology}</span>
                ))}
            </div>
        </section>
    )
}

export function WorkTimeline() {
    return workHistory.companies.map((company, i) => <WorkCard key={i} company={company} />)
}