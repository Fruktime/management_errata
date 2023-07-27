import React, {FC, ReactElement} from 'react';
import {
    Card,
    CardBody,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    PageSection,
    Title
} from "@patternfly/react-core";
import {CubesIcon} from "@patternfly/react-icons";
import {observer} from "mobx-react";
import {IReactComponent} from "mobx-react/dist/types/IReactComponent";

const EmptyStateBasic: IReactComponent = () => <EmptyState >
    <EmptyStateIcon icon={CubesIcon} />
    <Title headingLevel="h4" size="lg">
        Empty state
    </Title>
    <EmptyStateBody>
        This represents an the empty state pattern in Patternfly 4. Hopefully it's simple enough to use but flexible
        enough to meet a variety of needs.
    </EmptyStateBody>
</EmptyState>;

const Home: FC = () => {
    return (
        <PageSection isCenterAligned>
            <Card>
                <CardBody>
                    <EmptyStateBasic />
                </CardBody>
            </Card>
        </PageSection>
    );
};

export default observer(Home)
