import React from "react";
import { View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { SwipeableItem } from "@/components/SwipeableItem";
import { Hit } from "@/types/algoliaResponse";
import * as Animatable from "react-native-animatable";
import { Card, Title, IconButton, Subheading } from "react-native-paper";

type RenderListProps = Hit & {
    onSwipeRight?: () => Promise<void>;
    onSwipeLeft?: () => Promise<void>;
    index: number;
};

const ArticleHeader: React.FC<{ author: string; date: string }> = ({ author, date }) => (
    <View style={styles.headerContainer}>
        <IconButton icon="account" size={32} />
        <Subheading style={styles.subheading}>
            {author} - {date}
        </Subheading>
    </View>
);

const ArticleActions: React.FC<{ story_url: string }> = ({ story_url }) => (
    <Card.Actions>
        <Link href={{ pathname: "/screens/webview", params: { value: story_url } }} asChild>
            <IconButton icon="open-in-new" size={32} />
        </Link>
    </Card.Actions>
);

export const ArticleCard: React.FC<RenderListProps> = ({
    author,
    created_at,
    story_title,
    story_url,
    onSwipeRight,
    onSwipeLeft,
    index,
}) => {
    const date = new Date(created_at).toLocaleDateString();

    return (
        <Animatable.View animation="fadeIn" duration={500} delay={index * 300}>
            <SwipeableItem onSwipeLeft={onSwipeLeft} onSwipeRight={onSwipeRight}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title style={styles.title}>{story_title}</Title>
                        <ArticleHeader author={author} date={date} />
                    </Card.Content>
                    <ArticleActions story_url={story_url} />
                </Card>
            </SwipeableItem>
        </Animatable.View>
    );
};

const styles = StyleSheet.create({
    card: {
        margin: 10,
        elevation: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    subheading: {
        color: "#666",
    },
});
