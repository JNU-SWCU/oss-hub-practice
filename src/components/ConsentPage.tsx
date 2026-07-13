import { CheckCircle2, Github, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { StudentJourney } from "./StudentJourney";

type ConsentPageProps = {
  readonly onConsent: () => void;
};

export function ConsentPage({ onConsent }: ConsentPageProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <main className="page-shell student-flow-page">
      <StudentJourney current="consent" />
      <section className="consent-layout">
        <article className="consent-copy">
          <p className="section-kicker">학생 시연 최초 1회 동의</p>
          <h1>
            활동 정보 이용에 <span className="nowrap-phrase">동의해 주세요</span>
          </h1>
          <p>
            대회 신청, 팀 저장소 연결, 제출 현황 안내에 필요한 정보만 사용합니다. 공개 전환은 제출
            후 교직원 검토를 거쳐 별도로 진행됩니다.
          </p>
          <div className="consent-points">
            <ConsentPoint
              icon={<Github size={20} />}
              title="GitHub 계정 정보"
              description="GitHub ID와 이메일을 신청서에 채우고 팀 저장소 초대에 사용합니다."
            />
            <ConsentPoint
              icon={<ShieldCheck size={20} />}
              title="활동 공개 범위"
              description="행사 중에는 비공개이며, 검토와 공개 승인 뒤 아카이브에 표시됩니다."
            />
          </div>
        </article>
        <form
          className="consent-form"
          onSubmit={(event) => {
            event.preventDefault();
            if (!agreed) return;
            onConsent();
          }}
        >
          <CheckCircle2 size={24} />
          <h2>동의 확인</h2>
          <label className="consent-check">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(event) => setAgreed(event.target.checked)}
            />
            <span>
              개인정보 수집과 GitHub 활동 <span className="nowrap-phrase">이용에 동의합니다</span>
            </span>
          </label>
          <p>동의하면 학생 대시보드에서 다음 단계를 이어갑니다.</p>
          <button className="primary-action" type="submit" disabled={!agreed}>
            동의하고 내 대시보드로
          </button>
        </form>
      </section>
    </main>
  );
}

function ConsentPoint({
  icon,
  title,
  description,
}: {
  readonly icon: React.ReactNode;
  readonly title: string;
  readonly description: string;
}) {
  return (
    <section>
      <span aria-hidden="true">{icon}</span>
      <div>
        <h2>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}
